import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlayerDto, LoginDto } from './dto/player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  findAll(): Promise<Player[]> {
    return this.playersRepository.find({
      order: {
        reputacao: 'DESC' // Maior reputação primeiro
      }
    });
  }

  async findOne(id: number): Promise<Player> {
    const player = await this.playersRepository.findOneBy({ id });
    if (!player) throw new NotFoundException(`Jogador não encontrado`);
    return player;
  }

  create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = this.playersRepository.create({
      ...createPlayerDto,
      reputacao: 0,
    });
    return this.playersRepository.save(player);
  }

  async getUniqueGames(): Promise<string[]> {
    // Busca apenas a coluna de jogos favoritos de todos os players
    const players = await this.playersRepository.find({
      select: ['jogosFavoritos']
    });

    // 1. flatMap: Transforma [[A, B], [B, C]] em [A, B, B, C]
    const allGames = players.flatMap(p => p.jogosFavoritos);
    
    // 2. Set: Remove duplicatas (sobra [A, B, C])
    // 3. sort: Coloca em ordem alfabética
    const uniqueGames = [...new Set(allGames)].sort();

    return uniqueGames;
  }

  // --- NOVO MÉTODO DE LOGIN ---
  async login(loginDto: LoginDto): Promise<Player> {
    const player = await this.playersRepository.findOneBy({ email: loginDto.email });
    
    // Verifica se o usuário existe e se a senha bate
    if (player && player.senha === loginDto.senha) {
      // Retorna o usuário (sem a senha, por segurança)
      const { senha, ...result } = player;
      return result as Player; 
    }
    
    throw new UnauthorizedException('Credenciais inválidas');
  }

  async filtrar(jogo?: string, estilo?: string, nome?: string): Promise<Player[]> {

    const query = this.playersRepository.createQueryBuilder('player');

    if (jogo) {
      query.andWhere('player.jogosFavoritos ILIKE :jogo', { jogo: `%${jogo}%` });
    }

    if (estilo) {
      query.andWhere('player.estilo = :estilo', { estilo });
    }

    if (nome) {
      query.andWhere('player.nome ILIKE :nome', { nome: `%${nome}%` });
    }

    query.orderBy('player.reputacao', 'DESC');

    const resultados = await query.getMany();
    return resultados;
  }
  async update(id: number, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    // Verifica se o jogador existe
    const player = await this.findOne(id);

    // Mescla os dados antigos com os novos
    this.playersRepository.merge(player, updatePlayerDto);

    // Salva e retorna
    const updatedUser = await this.playersRepository.save(player);
    
    // Remove a senha do retorno por segurança
    const { senha, ...result } = updatedUser;
    return result as Player;
  }
}