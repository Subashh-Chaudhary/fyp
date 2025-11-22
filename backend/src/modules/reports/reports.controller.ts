import {
  Controller,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Res,
  Put,
  Body,
  HttpStatus,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { FeedbacksService } from '../feedbacks/feedbacks.service';
import { CreateFeedbackDto } from '../feedbacks/dtos/create-feedback.dto';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { UpdateReportDto } from './dtos/update-report.dto';

@Controller('')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly feedbacksService: FeedbacksService,
  ) {}

  @Get('reports')
  async list(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Res() res: Response,
    @Query('user_id') user_id?: string,
    @Query('crop_id') crop_id?: string,
    @Query('disease_id') disease_id?: string,
  ) {
    const result = await this.reportsService.findAll(page, limit, {
      user_id,
      crop_id,
      disease_id,
    });
    const response = ResponseHelper.paginated(
      result.items,
      result.page,
      result.limit,
      result.total,
      'Reports retrieved successfully',
      '/reports',
      'GET',
    );
    return res.status(response.statusCode).json(response);
  }

  @Get('reports/:id')
  async getById(@Param('id') id: string, @Res() res: Response) {
    const item = await this.reportsService.findById(id);
    const response = ResponseHelper.success(
      item,
      'Report retrieved successfully',
      200,
      `/reports/${id}`,
      'GET',
    );
    return res.status(response.statusCode).json(response);
  }

  @Put('reports/:id')
  async update(@Param('id') id: string, @Body() body: UpdateReportDto, @Res() res: Response) {
    const updated = await this.reportsService.update(id, body);
    const response = ResponseHelper.success(
      updated,
      'Report updated successfully',
      HttpStatus.OK,
      `/reports/${id}`,
      'PUT',
    );
    return res.status(response.statusCode).json(response);
  }

  // Report-scoped feedbacks
  @Get('reports/:report_id/feedbacks')
  async listFeedbacks(
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

  @Post('reports/:report_id/feedbacks')
  async createFeedbackForReport(@Param('report_id') report_id: string, @Body() body: CreateFeedbackDto, @Res() res: Response) {
    if (!body || !body.feedback_text || body.feedback_text.toString().trim() === '') {
      throw new BadRequestException('feedback_text is required');
    }
    const item = await this.feedbacksService.create({
      report_id,
      expert_id: body.expert_id,
      feedback_text: body.feedback_text,
      varified_at: body.varified_at ? new Date(body.varified_at) : undefined,
    });
    const response = ResponseHelper.created(item, 'Feedback created successfully', `/reports/${report_id}/feedbacks`, 'POST');
    return res.status(response.statusCode).json(response);
  }

  @Get('reports/:report_id/feedbacks/:id')
  async getFeedbackForReport(@Param('report_id') report_id: string, @Param('id') id: string, @Res() res: Response) {
    const item = await this.feedbacksService.findById(id);
    if (!item.report || item.report.id !== report_id) {
      throw new BadRequestException('Feedback does not belong to the specified report');
    }
    const response = ResponseHelper.success(item, 'Feedback retrieved successfully', 200, `/reports/${report_id}/feedbacks/${id}`, 'GET');
    return res.status(response.statusCode).json(response);
  }
}
