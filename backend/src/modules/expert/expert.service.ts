import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateExpertDto } from './dtos/update-expert.dto';
import { Experts } from './entities/expert.entity';

@Injectable()
export class ExpertService {
  constructor(
    @InjectRepository(Experts)
    private expertRepository: Repository<Experts>,
  ) {}

  /**
   * Find expert by ID
   * @param id - Expert ID
   * @returns Expert object or throws NotFoundException
   */
  async findById(id: string): Promise<Experts> {
    const expert = await this.expertRepository.findOne({
      where: { id: id },
    });

    if (!expert) {
      throw new NotFoundException('Expert not found');
    }

    return expert;
  }

  /**
   * Find expert by email
   * @param email - Expert email
   * @returns Expert object or undefined if not found
   */
  async findByEmail(email: string): Promise<Experts | undefined> {
    const expert = await this.expertRepository.findOne({
      where: { email },
    });
    return expert || undefined;
  }

  /**
   * Get all experts with pagination
   * @param page - Page number
   * @param limit - Number of items per page
   * @returns Object containing experts array and pagination metadata
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    items: Experts[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const skip = (page - 1) * limit;

    const [experts, total] = await this.expertRepository.findAndCount({
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      items: experts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  }

  /**
   * Update expert profile
   * @param id - Expert ID
   * @param updateData - Data to update
   * @returns Updated expert object
   */
  async updateExpert(
    id: string,
    updateData: UpdateExpertDto,
  ): Promise<Experts> {
    // Check if updateData is empty or contains no valid data
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new BadRequestException('No data provided for update');
    }

    // Check if all provided values are undefined or null
    const hasValidData = Object.values(updateData).some(
      (value) => value !== undefined && value !== null && value !== '',
    );

    if (!hasValidData) {
      throw new BadRequestException('No valid data provided for update');
    }

    const expert = await this.findById(id);

    // Check if email is being updated and if it already exists
    if (updateData.email && updateData.email !== expert.email) {
      const existingExpert = await this.expertRepository.findOne({
        where: { email: updateData.email },
      });

      if (existingExpert) {
        throw new ConflictException('Email already exists');
      }
    }

    // Update expert
    await this.expertRepository.update(id, updateData);

    // Return updated expert
    return this.findById(id);
  }

  /**
   * Delete expert by ID
   * @param id - Expert ID
   * @returns Success message
   */
  async deleteExpert(id: string): Promise<{ message: string }> {
    const expert = await this.findById(id);
    await this.expertRepository.remove(expert);

    return { message: 'Expert deleted successfully' };
  }

  /**
   * Find expert by social provider and social ID
   * @param provider - Social provider (e.g., 'google', 'facebook')
   * @param socialId - Social ID from the provider
   * @returns Expert object or undefined if not found
   */
  async findBySocialId(
    provider: string,
    socialId: string,
  ): Promise<Experts | undefined> {
    const expert = await this.expertRepository.findOne({
      where: { social_provider: provider, social_id: socialId },
    });
    return expert || undefined;
  }

  /**
   * Create a new expert
   * @param expertData - Expert data
   * @returns Created expert object
   */
  async createExpert(expertData: Partial<Experts>): Promise<Experts> {
    // Check if expertData is empty or contains no valid data
    if (!expertData || Object.keys(expertData).length === 0) {
      throw new BadRequestException('No data provided for expert creation');
    }

    // Check if all provided values are undefined or null
    const hasValidData = Object.values(expertData).some(
      (value) => value !== undefined && value !== null && value !== '',
    );

    if (!hasValidData) {
      throw new BadRequestException(
        'No valid data provided for expert creation',
      );
    }

    const expert = this.expertRepository.create(expertData);
    return this.expertRepository.save(expert);
  }
}
