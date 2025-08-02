import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/common/enums/user-role.enum';
import { hashPassword } from 'src/common/helpers/password.helper';
import { Repository } from 'typeorm';
import { ExpertService } from '../expert/expert.service';
import { CreateSocialUserDto, CreateUserDto } from './dtos/create-user.dto';
import { Users } from './entities/users.entity';
import { UsersRepository } from './repositories/users.repository';

/**
 * Users Service
 * Handles all user-related business logic including CRUD operations
 * Note: Registration is handled in the auth module
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly usersRepository: UsersRepository,
    private readonly expertService: ExpertService,
  ) {}

  /**
   * Find user by email across all tables
   * @param email - Email to search for
   * @returns User object or undefined if not found
   */
  async findByEmail(email: string): Promise<Users | undefined> {
    // Check in users table (admin and farmers)
    const adminUser = await this.usersRepository.findByEmail(email);
    if (adminUser) return adminUser;

    // Check in experts table
    const expertUser = await this.expertService.findByEmail(email);
    if (expertUser) return expertUser as unknown as Users;

    return undefined;
  }

  /**
   * Create a new admin user with email/password (legacy method)
   * @param createUserDto - User creation data
   * @returns Created user object
   */
  public async createUser(createUserDto: CreateUserDto): Promise<Users> {
    // Check if user already exists
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await hashPassword(createUserDto.password);

    // Create user entity
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      user_type: UserRole.ADMIN, // Default to admin for legacy compatibility
      is_verified: false, // Default to false, email verification needed
    });

    // Save and return the user
    return this.userRepository.save(user);
  }

  /**
   * Get all users with pagination
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @returns Object containing users array and pagination metadata
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: Users[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      users,
      total,
      page,
      limit,
    };
  }

  /**
   * Get users by type (admin, farmer)
   * @param userType - Type of user
   * @param page - Page number
   * @param limit - Number of items per page
   * @returns Object containing users array and pagination metadata
   */
  async findByType(
    userType: UserRole,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: Users[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAndCount({
      where: { user_type: userType },
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      users,
      total,
      page,
      limit,
    };
  }

  /**
   * Find user by ID
   * @param id - User ID
   * @returns User object or throws NotFoundException
   */
  async findById(id: string): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Update user by ID
   * @param id - User ID
   * @param updateData - Data to update
   * @returns Updated user object
   */
  async updateUser(id: string, updateData: Partial<Users>): Promise<Users> {
    const user = await this.findById(id);

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    // Update user
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  /**
   * Update farmer profile
   * @param id - Farmer ID
   * @param updateData - Farmer profile data to update
   * @returns Updated farmer user
   */
  async updateFarmerProfile(
    id: string,
    updateData: Partial<Users>,
  ): Promise<Users> {
    const user = await this.findById(id);

    // Verify this is a farmer
    if (user.user_type !== UserRole.FARMER) {
      throw new BadRequestException('User is not a farmer');
    }

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  /**
   * Delete user by ID
   * @param id - User ID
   * @returns Success message
   */
  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);

    return { message: 'User deleted successfully' };
  }

  /**
   * Find user by social ID and provider
   * @param provider - Social provider (e.g., 'google', 'facebook')
   * @param socialId - Social ID from the provider
   * @returns User object or undefined if not found
   */
  async findBySocialId(
    provider: string,
    socialId: string,
  ): Promise<Users | undefined> {
    return this.usersRepository.findBySocialId(provider, socialId);
  }

  /**
   * Create user from social login
   * @param profile - Social user profile data
   * @returns Created user object
   */
  async createSocialUser(profile: CreateSocialUserDto): Promise<Users> {
    // Check if email is already registered with password
    const emailUser = await this.usersRepository.findByEmail(profile.email);
    if (emailUser?.password) {
      throw new ConflictException('Email already registered with password');
    }

    return this.usersRepository.createSocialUser({
      ...profile,
    });
  }

  /**
   * Get farmer statistics
   * @returns Object containing farmer statistics
   */
  async getFarmerStatistics(): Promise<{
    total_farmers: number;
    average_farm_size: number;
    farm_types: { type: string; count: number }[];
  }> {
    const total_farmers = await this.userRepository.count({
      where: { user_type: UserRole.FARMER },
    });

    const avgFarmSize = (await this.userRepository
      .createQueryBuilder('user')
      .select('AVG(user.farm_size)', 'average')
      .where('user.user_type = :userType', { userType: UserRole.FARMER })
      .getRawOne()) as { average: string };

    const farmTypes = await this.userRepository
      .createQueryBuilder('user')
      .select('user.farm_type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('user.user_type = :userType', { userType: UserRole.FARMER })
      .groupBy('user.farm_type')
      .getRawMany();

    return {
      total_farmers: total_farmers,
      average_farm_size: parseFloat(avgFarmSize.average) || 0,
      farm_types: farmTypes.map((item: { type: string; count: string }) => ({
        type: item.type,
        count: parseInt(item.count, 10),
      })),
    };
  }

  /**
   * Get user statistics across all tables
   * @returns Object containing user statistics
   */
  async getStatistics(): Promise<{
    total_users: number;
    farmers_count: number;
    experts_count: number;
    admins_count: number;
    verified_users: number;
  }> {
    const admins_count = await this.userRepository.count({
      where: { user_type: UserRole.ADMIN },
    });
    const farmers_count = await this.userRepository.count({
      where: { user_type: UserRole.FARMER },
    });
    const experts_count = await this.expertService
      .findAll()
      .then((result) => result.total);
    const total_users = admins_count + farmers_count + experts_count;

    // For verified users, we need to check across all tables
    const verified_admins = await this.userRepository.count({
      where: { is_verified: true, user_type: UserRole.ADMIN },
    });
    const verified_farmers = await this.userRepository.count({
      where: { is_verified: true, user_type: UserRole.FARMER },
    });

    return {
      total_users,
      farmers_count,
      experts_count,
      admins_count,
      verified_users: verified_admins + verified_farmers, // Simplified for now
    };
  }
}
