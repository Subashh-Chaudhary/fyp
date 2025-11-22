import { IsOptional, IsUUID, IsString, IsUrl, IsBoolean } from 'class-validator';

export class UpdateReportDto {
  @IsOptional()
  @IsUUID()
  solution_id?: string | null;

  @IsOptional()
  @IsString()
  @IsUrl()
  report_url?: string | null;

  @IsOptional()
  @IsUUID()
  feedback_id?: string | null;

  @IsOptional()
  @IsBoolean()
    is_varified?: boolean;
}
