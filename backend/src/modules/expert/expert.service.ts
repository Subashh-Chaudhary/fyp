import {
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
      where: { id },
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

    console.log('experts', experts);
    console.log('total', total);
    console.log('totalPages', totalPages);
    console.log('hasNext', hasNext);
    console.log('hasPrev', hasPrev);

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
    const expert = await this.findById(id);

    // Check if email is being updated and if it already exists
    if (updateData.email && updateData.email !== expert.email) {
      const existingExpert = await this.expertRepository.findOne({
        where: { email: updateData.email },
      });

      if (existingExpert) {
        throw new ConflictException('Expert with this email already exists');
      }
    }

    Object.assign(expert, updateData);
    return this.expertRepository.save(expert);
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
   * Get available experts
   * @returns Array of available experts
   */
  async getAvailableExperts(): Promise<Experts[]> {
    return this.expertRepository.find({
      where: { is_available: true },
      order: { rating: 'DESC' },
    });
  }

  /**
   * Update expert availability
   * @param id - Expert ID
   * @param isAvailable - Availability status
   * @returns Updated expert object
   */
  async updateAvailability(id: string, isAvailable: boolean): Promise<Experts> {
    const expert = await this.findById(id);
    expert.is_available = isAvailable;
    return this.expertRepository.save(expert);
  }

  /**
   * Update expert rating
   * @param id - Expert ID
   * @param rating - New rating
   * @returns Updated expert object
   */
  async updateRating(id: string, rating: number): Promise<Experts> {
    const expert = await this.findById(id);
    expert.rating = rating;
    return this.expertRepository.save(expert);
  }

  /**
   * Increment total cases
   * @param id - Expert ID
   * @returns Updated expert object
   */
  async incrementCases(id: string): Promise<Experts> {
    const expert = await this.findById(id);
    expert.total_cases += 1;
    return this.expertRepository.save(expert);
  }

  /**
   * Search experts by specialization
   * @param specialization - Expert specialization
   * @returns Array of experts with matching specialization
   */
  async findBySpecialization(specialization: string): Promise<Experts[]> {
    return this.expertRepository.find({
      where: { specialization },
      order: { rating: 'DESC' },
    });
  }

  /**
   * Get experts by experience range
   * @param minYears - Minimum years of experience
   * @param maxYears - Maximum years of experience
   * @returns Array of experts within experience range
   */
  async findByExperienceRange(
    minYears: number,
    maxYears: number,
  ): Promise<Experts[]> {
    return this.expertRepository
      .createQueryBuilder('expert')
      .where('expert.experience_years >= :minYears', { minYears })
      .andWhere('expert.experience_years <= :maxYears', { maxYears })
      .orderBy('expert.rating', 'DESC')
      .getMany();
  }

  /**
   * Get top rated experts
   * @param limit - Number of experts to return
   * @returns Array of top rated experts
   */
  async getTopRatedExperts(limit: number = 10): Promise<Experts[]> {
    return this.expertRepository.find({
      order: { rating: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get expert statistics
   * @returns Expert statistics
   */
  async getExpertStats(): Promise<{
    total_experts: number;
    available_experts: number;
    average_rating: number;
    total_cases: number;
  }> {
    const totalExperts = await this.expertRepository.count();
    const availableExperts = await this.expertRepository.count({
      where: { is_available: true },
    });

    const avgRatingResult = await this.expertRepository
      .createQueryBuilder('expert')
      .select('AVG(expert.rating)', 'avgRating')
      .getRawOne<{ avgRating: string }>();

    const totalCasesResult = await this.expertRepository
      .createQueryBuilder('expert')
      .select('SUM(expert.total_cases)', 'totalCases')
      .getRawOne<{ totalCases: string }>();

    return {
      total_experts: totalExperts,
      available_experts: availableExperts,
      average_rating: parseFloat(avgRatingResult?.avgRating || '0'),
      total_cases: parseInt(totalCasesResult?.totalCases || '0'),
    };
  }
}
