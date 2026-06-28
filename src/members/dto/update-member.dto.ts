import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Gender } from '@prisma/client';

export class UpdateMemberDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsDateString()
  @IsOptional()
  date_of_birth?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  address?: string;
}
