import { IsUUID, IsString, IsOptional } from 'class-validator';

export class UpdateFeedbackDto {
  @IsOptional()
  @IsUUID()
  expert_id?: string;

  @IsOptional()
  @IsString()
  feedback_text?: string;

  @IsOptional()
  @IsString()
  varified_at?: string | null;
}
