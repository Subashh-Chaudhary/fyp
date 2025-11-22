import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedbacks } from './entities/feedback.entity';
import { Reports } from '../reports/entities/report.entity';
import { Experts } from '../expert/entities/expert.entity';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedbacks) private readonly repo: Repository<Feedbacks>,
    @InjectRepository(Reports) private readonly reportsRepo: Repository<Reports>,
    @InjectRepository(Experts) private readonly expertsRepo: Repository<Experts>,
  ) {}

  async create(params: {
    report_id: string;
    expert_id: string;
    feedback_text: string;
    varified_at?: Date | null;
  }): Promise<Feedbacks> {
    if (!params.feedback_text || params.feedback_text.toString().trim() === '') {
      throw new BadRequestException('feedback_text is required');
    }
    const report = await this.reportsRepo.findOne({ where: { id: params.report_id } });
    if (!report) throw new NotFoundException('Report not found');

    const expert = await this.expertsRepo.findOne({ where: { id: params.expert_id } });
    if (!expert) throw new NotFoundException('Expert not found');

    const entity = this.repo.create({
      report,
      expert,
      feedback_text: params.feedback_text,
      varified_at: params.varified_at ?? new Date(),
    });

    const saved = await this.repo.save(entity);

    // Link feedback to report
    try {
      await this.reportsRepo.update(report.id, { feedback_id: saved.id, is_varified: true });
    } catch (e) {
      // non-fatal, log if you have logger; swallow to avoid rollback complexities
    }

    return saved;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: { report_id?: string; expert_id?: string },
  ): Promise<{ items: Feedbacks[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters?.report_id) where.report = { id: filters.report_id };
    if (filters?.expert_id) where.expert = { id: filters.expert_id };

    const [items, total] = await this.repo.findAndCount({
      where,
      relations: ['expert', 'report', 'report.crop', 'report.disease', 'report.solution'],
      order: { varified_at: 'DESC' },
      skip,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async findById(id: string): Promise<Feedbacks> {
    const item = await this.repo.findOne({
      where: { id },
      relations: ['expert', 'report', 'report.crop', 'report.disease', 'report.solution'],
    });
    if (!item) throw new NotFoundException('Feedback not found');
    return item;
  }

  async update(id: string, updateData: any): Promise<Feedbacks> {
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new BadRequestException('No data provided for update');
    }

    const item = await this.findById(id);
    const filtered: any = Object.fromEntries(
      Object.entries(updateData).filter(([, v]) => v !== undefined),
    );

    if ('expert_id' in filtered) {
      filtered.expert = filtered.expert_id === null ? null : { id: filtered.expert_id };
      delete filtered.expert_id;
    }

    if ('varified_at' in filtered && filtered.varified_at !== null) {
      filtered.varified_at = new Date(filtered.varified_at);
    }

    await this.repo.update(id, filtered as any);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findById(id);
    await this.repo.delete(id);

    // unlink from report if linked
    try {
      const report = await this.reportsRepo.findOne({ where: { id: item.report.id } });
      if (report && report.feedback_id === id) {
        await this.reportsRepo.update(report.id, { feedback_id: null, is_varified: false });
      }
    } catch (e) {
      // swallow
    }
  }
}
