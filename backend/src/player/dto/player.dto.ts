import { IsString, IsInt, IsArray, IsEnum, IsOptional, IsEmail } from 'class-validator';

export enum EstiloJogo {
  CASUAL = 'Casual',
  COMPETITIVO = 'Competitivo',
  FOR_FUN = 'For Fun',
}

export class CreatePlayerDto {
  @IsString()
  nome: string;

  @IsEmail() // Valida se é um email real
  email: string;

  @IsString()
  senha: string;

  @IsString()
  avatar: string;

  @IsString()
  bio: string;

  @IsEnum(EstiloJogo)
  estilo: EstiloJogo;

  @IsArray()
  plataformas: string[];

  @IsArray()
  jogosFavoritos: string[];

  @IsString()
  disponibilidade: string;

  @IsOptional()
  @IsString()
  localizacao?: string;
}

// DTO específico para o Login
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  senha: string;
}