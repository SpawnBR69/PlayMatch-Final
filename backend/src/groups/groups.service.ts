import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThan, LessThan } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { Player } from '../player/entities/player.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    // Injete o repositório de Players
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = this.groupsRepository.create({
      ...createGroupDto,
      membrosIds: [createGroupDto.donoId.toString()]
    });
    return this.groupsRepository.save(group);
  }

  async findAll(
    status: 'upcoming' | 'past' | 'all',
    filters: { nome?: string; jogo?: string; inicio?: string; fim?: string }
  ): Promise<Group[]> {
    const qb = this.groupsRepository.createQueryBuilder('group');
    const now = new Date();

    // 1. Filtros Básicos de Status
    if (status === 'upcoming') {
      qb.andWhere('group.data > :now', { now });
    } else if (status === 'past') {
      qb.andWhere('group.data <= :now', { now });
    }

    // 2. Filtros Avançados (Se existirem)
    if (filters.nome) {
      qb.andWhere('group.titulo ILIKE :nome', { nome: `%${filters.nome}%` });
    }
    if (filters.jogo) {
      qb.andWhere('group.jogo ILIKE :jogo', { jogo: `%${filters.jogo}%` });
    }
    if (filters.inicio) {
      qb.andWhere('group.data >= :inicio', { inicio: filters.inicio });
    }
    if (filters.fim) {
      qb.andWhere('group.data <= :fim', { fim: filters.fim });
    }

    // 3. Ordenação Inteligente
    if (status === 'all') {
      // TRUQUE SQL: Cria uma coluna virtual que vale 0 se for futuro, 1 se for passado.
      // Ordenamos por essa coluna primeiro, jogando os futuros para o topo.
      qb.addOrderBy('CASE WHEN group.data > :nowSort THEN 0 ELSE 1 END', 'ASC');
      qb.setParameter('nowSort', now);
      
      // Dentro de cada grupo (futuro/passado), ordena por data crescente (mais próximo primeiro)
      qb.addOrderBy('group.data', 'ASC');
    } else if (status === 'past') {
      // Passados geralmente queremos ver do mais recente para o mais antigo
      qb.orderBy('group.data', 'DESC');
    } else {
      // Futuros: do mais próximo para o mais distante
      qb.orderBy('group.data', 'ASC');
    }

    return qb.getMany();
  }

  // --- NOVO MÉTODO: Busca Grupo + Detalhes dos Membros ---
  async findOneWithMembers(id: number) {
    const group = await this.groupsRepository.findOneBy({ id });
    if (!group) throw new NotFoundException('Grupo não encontrado');

    // Se não tiver membros ou array vazio
    if (!group.membrosIds || group.membrosIds.length === 0) {
      return { ...group, membrosDetalhados: [] };
    }

    // Busca os jogadores baseados nos IDs salvos
    // Convertemos para número pois 'In' espera o tipo correto
    const memberIds = group.membrosIds.map(id => Number(id));
    
    const members = await this.playersRepository.find({
      where: { id: In(memberIds) },
      select: ['id', 'nome', 'avatar', 'estilo', 'reputacao'] // Só o necessário
    });

    // Retorna o grupo original + um novo campo com os objetos completos
    return { ...group, membrosDetalhados: members };
  }
  // -------------------------------------------------------

  async joinGroup(groupId: number, playerId: number): Promise<Group> {
    const group = await this.groupsRepository.findOneBy({ id: groupId });
    if (!group) throw new NotFoundException('Grupo não encontrado');

    if (new Date(group.data) < new Date()) {
        throw new BadRequestException('Este evento já foi encerrado.');
    }

    if (!group.membrosIds) group.membrosIds = [];
    if (group.membrosIds.length >= group.vagas) throw new BadRequestException('Grupo lotado!');
    if (group.membrosIds.includes(playerId.toString())) throw new BadRequestException('Você já está neste grupo!');

    group.membrosIds.push(playerId.toString());
    return this.groupsRepository.save(group);
  }
}