import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePackageCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
