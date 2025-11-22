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
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dtos/create-feedback.dto';
import { UpdateFeedbackDto } from './dtos/update-feedback.dto';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

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

  @Post()
  async create(@Body() body: CreateFeedbackDto, @Res() res: Response) {
    const item = await this.feedbacksService.create({
      report_id: body.report_id,
      expert_id: body.expert_id,
      feedback_text: body.feedback_text,
      varified_at: body.varified_at ? new Date(body.varified_at) : undefined,
    });
    const response = ResponseHelper.created(item, 'Feedback created successfully', '/feedbacks', 'POST');
    return res.status(response.statusCode).json(response);
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Res() res: Response) {
    const item = await this.feedbacksService.findById(id);
    const response = ResponseHelper.success(item, 'Feedback retrieved successfully', 200, `/feedbacks/${id}`, 'GET');
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
