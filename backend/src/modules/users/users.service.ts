import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/common/helpers/password.helper';
import { Repository } from 'typeorm';
import { CreateSocialUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
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
  ) {}

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
   * Find user by email
   * @param email - User email
   * @returns User object or undefined if not found
   */
  async findByEmail(email: string): Promise<Users | undefined> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return user || undefined;
  }

  /**
   * Get all users with pagination
   * @param page - Page number
   * @param limit - Number of items per page
   * @returns Object containing users array and pagination metadata
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    users: Users[];
    total: number;
    page: number;
    limit: number;
  }> {
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
   * Update user by ID
   * @param id - User ID
   * @param updateData - Data to update
   * @returns Updated user object
   */
  async updateUser(id: string, updateData: UpdateUserDto): Promise<Users> {
    const user = await this.findById(id);

    // Check if email is being updated and if it already exists
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateData.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
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
}
