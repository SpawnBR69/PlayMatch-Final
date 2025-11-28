import { IsInt, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  authorId: number;

  @IsString()
  authorName: string;

  @IsInt()
  targetId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;
}