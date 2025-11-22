import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reports } from './entities/report.entity';
import { Users } from '../users/entities/users.entity';
import { Crops } from '../crops/entities/crop.entity';
import { Diseases } from '../diseases/entities/disease.entity';
import { Solutions } from '../solutions/entities/solution.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Reports) private readonly repo: Repository<Reports>,
    @InjectRepository(Users) private readonly usersRepo: Repository<Users>,
  ) {}

  async createReport(params: {
    user_id?: string | null;
    crop: Crops;
    disease: Diseases;
    solution?: Solutions | null;
    report_url?: string | null;
  }): Promise<Reports> {
    const { user_id, crop, disease, solution, report_url } = params;
    let user: Users | null = null;
    if (user_id) {
      user = await this.usersRepo.findOne({ where: { id: user_id } });
    }
    const entity = this.repo.create({
      user: user ?? null,
      crop,
      disease,
      solution: solution ?? null,
      feedback_id: null,
      report_url: report_url ?? null,
      generated_at: new Date(),
    });
    return this.repo.save(entity);
  }

  async update(id: string, updateData: any): Promise<Reports> {
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new BadRequestException('No data provided for update');
    }
    const report = await this.findById(id);
    const filtered: any = Object.fromEntries(
      Object.entries(updateData).filter(([, v]) => v !== undefined),
    );

    // map solution_id to relation object if provided
    if ('solution_id' in filtered) {
      filtered.solution = filtered.solution_id === null ? null : { id: filtered.solution_id };
      delete filtered.solution_id;
    }

    await this.repo.update(id, filtered as any);
    return this.findById(id);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: { user_id?: string; crop_id?: string; disease_id?: string },
  ): Promise<{ items: Reports[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters?.user_id) where.user = { id: filters.user_id };
    if (filters?.crop_id) where.crop = { id: filters.crop_id };
    if (filters?.disease_id) where.disease = { id: filters.disease_id };

    const [items, total] = await this.repo.findAndCount({
      where,
      relations: ['user', 'crop', 'disease', 'solution'],
      order: { generated_at: 'DESC' },
      skip,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async findById(id: string): Promise<Reports> {
    const report = await this.repo.findOne({
      where: { id },
      relations: ['user', 'crop', 'disease', 'solution'],
    });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }
}
