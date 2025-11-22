import { IsUUID, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFeedbackDto {
  @IsUUID()
  report_id: string;

  @IsUUID()
  expert_id: string;

  @IsString()
  @IsNotEmpty()
  feedback_text: string;

  @IsOptional()
  @IsString()
  varified_at?: string | null;
}
