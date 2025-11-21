import { IsBoolean, IsISO8601, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class UpdateNewsDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string | null;

  @IsOptional()
  @IsString()
  source?: string | null;

  @IsOptional()
  @IsISO8601()
  publish_date?: string | null;

  @IsOptional()
  @IsString()
  category?: string | null;

  @IsOptional()
  @IsUrl()
  url?: string | null;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
