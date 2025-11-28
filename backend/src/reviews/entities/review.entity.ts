import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authorId: number; // Quem escreveu

  @Column()
  authorName: string; // Nome do autor (para facilitar exibição)

  @Column()
  targetId: number; // Quem recebeu a avaliação

  @Column()
  rating: number; // Nota de 1 a 5

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}