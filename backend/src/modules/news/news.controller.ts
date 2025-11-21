import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  DefaultValuePipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { CreateNewsDto } from './dtos/create-news.dto';
import { UpdateNewsDto } from './dtos/update-news.dto';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Res() res: Response,
  ) {
    const result = await this.newsService.findAll(page, limit);
    const response = ResponseHelper.paginated(
      result.news,
      result.page,
      result.limit,
      result.total,
      'News retrieved successfully',
      '/news',
      'GET',
    );
    return res.status(response.statusCode).json(response);
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Res() res: Response) {
    const n = await this.newsService.findById(id);
    const response = ResponseHelper.success(n, 'News retrieved successfully', HttpStatus.OK, `/news/${id}`, 'GET');
    return res.status(response.statusCode).json(response);
  }

  @Post()
  async create(@Body() body: CreateNewsDto, @Res() res: Response) {
    console.log('Received create request with body:', body);
    const created = await this.newsService.create(body);
    const response = ResponseHelper.success(created, 'News created successfully', HttpStatus.CREATED, '/news', 'POST');
    return res.status(response.statusCode).json(response);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateNewsDto, @Res() res: Response) {
    const updated = await this.newsService.update(id, body);
    const response = ResponseHelper.success(updated, 'News updated successfully', HttpStatus.OK, `/news/${id}`, 'PUT');
    return res.status(response.statusCode).json(response);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const result = await this.newsService.delete(id);
    const response = ResponseHelper.success(result, 'News deleted successfully', HttpStatus.OK, `/news/${id}`, 'DELETE');
    return res.status(response.statusCode).json(response);
  }
}
