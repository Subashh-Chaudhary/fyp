import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { BadRequestException } from '@nestjs/common';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dtos/create-feedback.dto';
import { UpdateFeedbackDto } from './dtos/update-feedback.dto';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  private readonly logger = new Logger(FeedbacksController.name);

  @Get()
  async list(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Res() res: Response,
    @Query('report_id') report_id?: string,
    @Query('expert_id') expert_id?: string,
  ) {
    const result = await this.feedbacksService.findAll(page, limit, { report_id, expert_id });
    const response = ResponseHelper.paginated(
      result.items,
      result.page,
      result.limit,
      result.total,
      'Feedbacks retrieved successfully',
      '/feedbacks',
      'GET',
    );
    return res.status(response.statusCode).json(response);
  }

  // Report-specific list: GET /reports/:report_id/feedbacks
  @Get('reports/:report_id/feedbacks')
  async listByReport(
    @Param('report_id') report_id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Res() res: Response,
  ) {
    const result = await this.feedbacksService.findAll(page, limit, { report_id });
    const response = ResponseHelper.paginated(
      result.items,
      result.page,
      result.limit,
      result.total,
      'Report feedbacks retrieved successfully',
      `/reports/${report_id}/feedbacks`,
      'GET',
    );
    return res.status(response.statusCode).json(response);
  }

  @Post()
  async create(@Body() body: CreateFeedbackDto, @Res() res: Response) {
    // Debug log to inspect incoming payload (temporary)
    this.logger.debug(`Create feedback body: ${JSON.stringify(body)}`);

    if (!body || !body.feedback_text || body.feedback_text.toString().trim() === '') {
      throw new BadRequestException('feedback_text is required');
    }

    const item = await this.feedbacksService.create({
      report_id: body.report_id,
      expert_id: body.expert_id,
      feedback_text: body.feedback_text,
      varified_at: body.varified_at ? new Date(body.varified_at) : undefined,
    });
    const response = ResponseHelper.created(item, 'Feedback created successfully', '/feedbacks', 'POST');
    return res.status(response.statusCode).json(response);
  }

  // Create feedback scoped to a report: POST /reports/:report_id/feedbacks
  @Post('reports/:report_id/feedbacks')
  async createForReport(@Param('report_id') report_id: string, @Body() body: Partial<CreateFeedbackDto>, @Res() res: Response) {
    // Ensure feedback_text present
    this.logger.debug(`Create feedback (scoped) body: ${JSON.stringify(body)}, report_id: ${report_id}`);
    if (!body || !body.feedback_text || body.feedback_text.toString().trim() === '') {
      throw new BadRequestException('feedback_text is required');
    }

    const item = await this.feedbacksService.create({
      report_id,
      expert_id: body.expert_id as string,
      feedback_text: body.feedback_text as string,
      varified_at: body.varified_at ? new Date(body.varified_at as string) : undefined,
    });
    const response = ResponseHelper.created(item, 'Feedback created successfully', `/reports/${report_id}/feedbacks`, 'POST');
    return res.status(response.statusCode).json(response);
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Res() res: Response) {
    const item = await this.feedbacksService.findById(id);
    const response = ResponseHelper.success(item, 'Feedback retrieved successfully', 200, `/feedbacks/${id}`, 'GET');
    return res.status(response.statusCode).json(response);
  }

  // GET /reports/:report_id/feedbacks/:id
  @Get('reports/:report_id/feedbacks/:id')
  async getByIdForReport(@Param('report_id') report_id: string, @Param('id') id: string, @Res() res: Response) {
    const item = await this.feedbacksService.findById(id);
    if (!item.report || item.report.id !== report_id) {
      throw new BadRequestException('Feedback does not belong to the specified report');
    }
    const response = ResponseHelper.success(item, 'Feedback retrieved successfully', 200, `/reports/${report_id}/feedbacks/${id}`, 'GET');
    return res.status(response.statusCode).json(response);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateFeedbackDto, @Res() res: Response) {
    const item = await this.feedbacksService.update(id, body);
    const response = ResponseHelper.success(item, 'Feedback updated successfully', 200, `/feedbacks/${id}`, 'PUT');
    return res.status(response.statusCode).json(response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.feedbacksService.remove(id);
    const response = ResponseHelper.noContent('Feedback deleted successfully', `/feedbacks/${id}`, 'DELETE');
    return res.status(response.statusCode).json(response);
  }
}
