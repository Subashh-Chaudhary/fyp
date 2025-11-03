import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/users.entity';
import { CreateCropDto, UpdateCropDto } from './dtos';
import { Crops } from './entities/crop.entity';
import { CloudinaryService } from '../../common/services/cloudinary.service';

@Injectable()
export class CropsService {
  constructor(
    @InjectRepository(Crops)
    private readonly cropsRepository: Repository<Crops>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async ensureUser(user_id: string): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(
    dto: CreateCropDto,
    opts?: { file?: any; diseaseId?: string },
  ): Promise<Crops> {
    let user: Users | undefined;
    if (dto.user_id) {
      user = await this.ensureUser(dto.user_id);
    }

    if (!opts?.file) {
      throw new BadRequestException('Image file (image_url) is required');
    }

    const secureUrl = await this.cloudinary.uploadImageBuffer(opts.file, {
      folder: 'crops',
    });

    const crop = this.cropsRepository.create({
      user: user as any,
      image_url: secureUrl,
      disease_id: opts?.diseaseId ?? dto.disease_id ?? null,
      scanned_at: dto.scanned_at ? new Date(dto.scanned_at) : new Date(),
    });
    return this.cropsRepository.save(crop);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: { user_id?: string; disease_id?: string },
  ): Promise<{ items: Crops[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters?.user_id) {
      where.user = { id: filters.user_id };
    }
    if (filters?.disease_id) {
      where.disease_id = filters.disease_id;
    }

    const [items, total] = await this.cropsRepository.findAndCount({
      where,
      relations: ['user'],
      skip,
      take: limit,
      order: { scanned_at: 'DESC' },
    });
    return { items, total, page, limit };
  }

  async findById(id: string): Promise<Crops> {
    const crop = await this.cropsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!crop) throw new NotFoundException('Crop not found');
    return crop;
  }

  async update(
    id: string,
    dto: UpdateCropDto,
    opts?: { file?: any },
  ): Promise<Crops> {
    const crop = await this.findById(id);

    const payload: Partial<Crops> = {};
    if (dto.disease_id) payload.disease_id = dto.disease_id;
    if (dto.scanned_at) payload.scanned_at = new Date(dto.scanned_at);
    if (opts?.file) {
      const secureUrl = await this.cloudinary.uploadImageBuffer(opts.file, {
        folder: 'crops',
      });
      payload.image_url = secureUrl;
    }

    if (Object.keys(payload).length === 0) {
      throw new BadRequestException('No valid data provided for update');
    }

    await this.cropsRepository.update(id, payload);
    return this.findById(id);
  }

  async delete(id: string): Promise<{ message: string }> {
    const crop = await this.findById(id);
    await this.cropsRepository.remove(crop);
    return { message: 'Crop deleted successfully' };
  }
}
