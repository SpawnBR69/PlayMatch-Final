import { IsString, IsInt, IsEnum, Min, IsDateString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  titulo: string;

  @IsString()
  jogo: string;

  @IsString()
  descricao: string;

  @IsInt()
  @Min(2)
  vagas: number;

  @IsInt()
  donoId: number;

  @IsEnum(['Online', 'Presencial'])
  tipo: 'Online' | 'Presencial';

  @IsDateString() 
  data: string;
}