import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm'; // Importe 'In'
import { Message } from './entities/message.entity';
import { Block } from './entities/block.entity';
import { Player } from '../player/entities/player.entity'; // Importe Player

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message) private msgRepo: Repository<Message>,
    @InjectRepository(Block) private blockRepo: Repository<Block>,
    @InjectRepository(Player) private playerRepo: Repository<Player>, // Injeção nova
  ) {}

  async sendMessage(senderId: number, receiverId: number, content: string) {
    const isBlocked = await this.blockRepo.findOneBy({ 
      blockerId: receiverId, blockedId: senderId 
    });
    if (isBlocked) throw new BadRequestException('Usuário bloqueou você.');

    const msg = this.msgRepo.create({ senderId, receiverId, content });
    return this.msgRepo.save(msg);
  }

  async getConversation(userA: number, userB: number) {
    return this.msgRepo.find({
      where: [
        { senderId: userA, receiverId: userB },
        { senderId: userB, receiverId: userA },
      ],
      order: { createdAt: 'ASC' }
    });
  }

  async blockUser(blockerId: number, blockedId: number) {
    const exists = await this.blockRepo.findOneBy({ blockerId, blockedId });
    if (exists) return exists;
    const block = this.blockRepo.create({ blockerId, blockedId });
    return this.blockRepo.save(block);
  }

  // --- MÉTODO ATUALIZADO: Retorna Players em vez de números ---
  async getContacts(myId: number): Promise<Player[]> {
    // 1. Busca mensagens enviadas ou recebidas por mim
    const msgs = await this.msgRepo.find({
      where: [{ senderId: myId }, { receiverId: myId }],
      order: { createdAt: 'DESC' }
    });

    // 2. Extrai IDs únicos dos outros participantes
    const contactIds = new Set<number>();
    msgs.forEach(m => {
      const otherId = m.senderId === myId ? m.receiverId : m.senderId;
      contactIds.add(otherId);
    });

    // 3. Se não tiver contatos, retorna vazio
    if (contactIds.size === 0) return [];

    // 4. Busca os dados completos desses usuários
    // Removemos a senha antes de retornar (segurança básica)
    const players = await this.playerRepo.find({
      where: { id: In([...contactIds]) },
      select: ['id', 'nome', 'avatar', 'estilo', 'reputacao'] // Seleciona só o necessário
    });

    return players;
  }
  
  async getBlockedUsers(blockerId: number): Promise<Player[]> {
    // Busca na tabela de bloqueios
    const blocks = await this.blockRepo.find({ where: { blockerId } });
    
    if (blocks.length === 0) return [];

    // Extrai os IDs dos bloqueados
    const blockedIds = blocks.map(b => b.blockedId);

    // Busca os dados desses jogadores
    return this.playerRepo.find({
      where: { id: In(blockedIds) },
      select: ['id', 'nome', 'avatar', 'estilo'] // Trazemos apenas o básico
    });
  }

  // 2. Desbloquear usuário
  async unblockUser(blockerId: number, blockedId: number) {
    return this.blockRepo.delete({ blockerId, blockedId });
  }
}