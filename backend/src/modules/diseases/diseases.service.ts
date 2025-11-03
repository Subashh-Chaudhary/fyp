import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diseases } from './entities/disease.entity';

@Injectable()
export class DiseasesService {
  constructor(
    @InjectRepository(Diseases)
    private readonly repo: Repository<Diseases>,
  ) {}

  async findByName(name: string): Promise<Diseases | null> {
    return this.repo.findOne({ where: { name } });
  }

  async create(input: Partial<Diseases>): Promise<Diseases> {
    const entity = this.repo.create(input);
    return this.repo.save(entity);
  }

  async findOrCreateByName(
    name: string,
    description?: string | null,
  ): Promise<Diseases> {
    const existing = await this.findByName(name);
    if (existing) return existing;
    return this.create({ name, description: description ?? null });
  }
}
