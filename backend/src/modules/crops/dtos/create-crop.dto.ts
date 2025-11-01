import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCropDto {
  @IsOptional()
  @IsUUID(undefined, { message: 'user_id must be a valid UUID' })
  user_id?: string;

  @IsOptional()
  @IsUUID(undefined, { message: 'disease_id must be a valid UUID' })
  disease_id?: string;

  @IsOptional()
  @IsString({ message: 'scanned_at must be an ISO string date if provided' })
  scanned_at?: string;
}
