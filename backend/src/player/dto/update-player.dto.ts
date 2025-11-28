import { IsString, IsArray, IsEnum, IsOptional } from 'class-validator';
import { EstiloJogo } from './player.dto';

export class UpdatePlayerDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsEnum(EstiloJogo)
  estilo?: EstiloJogo;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  jogosFavoritos?: string[];

  @IsOptional()
  @IsString()
  disponibilidade?: string;
  
  @IsOptional()
  @IsString()
  avatar?: string;
}