import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Player } from '../player/entities/player.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
    @InjectRepository(Player) private playerRepo: Repository<Player>,
  ) {}

  async create(dto: CreateReviewDto): Promise<Review> {

    const existingReview = await this.reviewRepo.findOne({
      where: {
        authorId: dto.authorId,
        targetId: dto.targetId
      }
    });

    if (existingReview) {
      throw new BadRequestException('Você já avaliou este jogador. Apenas uma avaliação por perfil é permitida.');
    }
    // 1. Salva a avaliação
    const review = this.reviewRepo.create(dto);
    const savedReview = await this.reviewRepo.save(review);

    // 2. Recalcula a reputação do jogador alvo
    await this.updatePlayerReputation(dto.targetId);

    return savedReview;
  }

  async findAllByTarget(targetId: number): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { targetId },
      order: { createdAt: 'DESC' }
    });
  }

  private async updatePlayerReputation(playerId: number) {
    // Busca todas as reviews desse jogador
    const reviews = await this.reviewRepo.find({ where: { targetId: playerId } });
    
    if (reviews.length > 0) {
      // Calcula média
      const total = reviews.reduce((sum, r) => sum + r.rating, 0);
      const average = total / reviews.length;
      
      // Atualiza na tabela de Player (arredondando para 1 casa decimal)
      await this.playerRepo.update(playerId, { reputacao: Number(average.toFixed(1)) });
    }
  }
}