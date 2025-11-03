import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solutions } from './entities/solution.entity';
import { Diseases } from '../diseases/entities/disease.entity';

@Injectable()
export class SolutionsService {
  constructor(
    @InjectRepository(Solutions)
    private readonly repo: Repository<Solutions>,
  ) {}

  async createForDisease(
    disease: Diseases,
    description?: string | null,
  ): Promise<Solutions> {
    const entity = this.repo.create({
      disease,
      description: description ?? null,
    });
    return this.repo.save(entity);
  }
}
