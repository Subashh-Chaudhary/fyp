import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dtos/create-news.dto';
import { UpdateNewsDto } from './dtos/update-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly repo: Repository<News>,
  ) {}

  async create(input: CreateNewsDto): Promise<News> {
    console.log('Creating news with input:', input);
    console.log('Input title:', input?.title);
    if (!input || !input.title) {
      throw new BadRequestException('Title is required');
    }
    const entity = this.repo.create({
      ...input,
      is_active: input.is_active === undefined ? true : !!input.is_active,
    });
    return this.repo.save(entity);
  }

  async findAll(page = 1, limit = 10): Promise<{ news: News[]; total: number; page: number; limit: number }>{
    const skip = (page - 1) * limit;
    const [news, total] = await this.repo.findAndCount({
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });
    return { news, total, page, limit };
  }

  async findById(id: string): Promise<News> {
    const n = await this.repo.findOne({ where: { id } });
    if (!n) throw new NotFoundException('News not found');
    return n;
  }

  async update(id: string, updateData: UpdateNewsDto): Promise<News> {
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new BadRequestException('No data provided for update');
    }
    const n = await this.findById(id);
    const filtered: Partial<UpdateNewsDto> = Object.fromEntries(
      Object.entries(updateData).filter(([, v]) => v !== undefined),
    ) as Partial<UpdateNewsDto>;
    await this.repo.update(id, filtered as any);
    return this.findById(id);
  }

  async delete(id: string): Promise<{ message: string }> {
    const n = await this.findById(id);
    await this.repo.remove(n);
    return { message: 'News deleted successfully' };
  }
}
