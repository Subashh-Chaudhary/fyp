import { IsOptional, IsUUID, IsUrl, IsString } from 'class-validator';

export class UpdateCropDto {
  @IsOptional()
  @IsUUID(undefined, { message: 'disease_id must be a valid UUID' })
  disease_id?: string;

  @IsOptional()
  @IsUrl({}, { message: 'image_url must be a valid URL if provided' })
  image_url?: string;

  @IsOptional()
  @IsString({ message: 'scanned_at must be an ISO string date if provided' })
  scanned_at?: string;
}