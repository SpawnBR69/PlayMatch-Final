import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  blockerId: number; // Quem bloqueou

  @Column()
  blockedId: number; // Quem foi bloqueado
}