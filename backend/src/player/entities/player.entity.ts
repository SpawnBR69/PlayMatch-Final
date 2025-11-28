import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { EstiloJogo } from '../dto/player.dto';

@Entity() // Diz ao TypeORM que isso é uma tabela
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true }) // Email não pode repetir
  email: string;

  @Column()
  senha: string;

  @Column()
  avatar: string;

  @Column({ type: 'text' }) // Text para descrições longas
  bio: string;

  @Column('decimal', { precision: 2, scale: 1, default: 0 })
  reputacao: number;

  @Column({
    type: 'enum',
    enum: EstiloJogo,
    default: EstiloJogo.CASUAL
  })
  estilo: EstiloJogo;

  @Column('simple-array') // O banco salvará como "PC,Xbox"
  plataformas: string[];

  @Column('simple-array')
  jogosFavoritos: string[];

  @Column()
  disponibilidade: string;

  @Column({ nullable: true })
  localizacao: string;
}