import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  jogo: string;

  @Column()
  descricao: string;

  @Column()
  vagas: number;

  // Guarda os IDs dos jogadores que entraram (ex: "1,4,5")
  @Column('simple-array', { nullable: true })
  membrosIds: string[]; 

  @Column()
  donoId: number; // Quem criou o grupo

  @Column()
  tipo: 'Online' | 'Presencial';

  @Column({ type: 'timestamp' })
  data: Date;
}