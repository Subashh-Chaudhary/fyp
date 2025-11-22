export class CreateFeedbackDto {
  report_id: string;
  expert_id: string;
  feedback_text: string;
  varified_at?: string | null;
}
