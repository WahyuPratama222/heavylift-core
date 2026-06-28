import { IsString, IsUrl } from 'class-validator';

export class UpdatePhotoDto {
  @IsString()
  @IsUrl()
  photo_url: string;
}
