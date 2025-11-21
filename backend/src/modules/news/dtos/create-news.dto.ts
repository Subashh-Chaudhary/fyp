import { IsBoolean, IsISO8601, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsISO8601()
  publish_date?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
