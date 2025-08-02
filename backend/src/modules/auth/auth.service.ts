// src/auth/auth.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/common/enums/user-role.enum';
import {
  comparePasswords,
  hashPassword,
} from 'src/common/helpers/password.helper';
import { Repository } from 'typeorm';
import { Experts } from '../expert/entities/expert.entity';
import { ExpertService } from '../expert/expert.service';
import { Users } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

interface IUserData {
  id: string;
  email: string;
  name: string;
  user_type: UserRole;
  social_provider?: string;
  social_id?: string;
}

interface UserWithPassword {
  id: string;
  email: string;
  name: string;
  password: string;
  user_type: UserRole;
}

/**
 * Auth Service
 * Handles JWT token generation, authentication logic, and user registration
 */
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private expertService: ExpertService,
    @InjectRepository(Experts)
    private expertRepository: Repository<Experts>,
  ) {}

  /**
   * Register a new user (farmer or expert)
   * @param registerDto - Registration data
   * @returns Object containing user data and access token
   */
  async register(registerDto: RegisterDto): Promise<{
    user: Record<string, unknown>;
    access_token: string;
    type: string;
  }> {
    // Check if email already exists in any user table
    const emailExists = await this.checkEmailExists(registerDto.email);
    if (emailExists) {
      throw new ConflictException('User with this email already exists');
    }

    let user: Record<string, any>;
    let userType: UserRole;

    if (registerDto.user_type === UserRole.EXPERT) {
      // Create expert user in experts table
      user = await this.createExpertUser({
        name: registerDto.name,
        email: registerDto.email,
        password: registerDto.password,
        phone: registerDto.phone,
        address: registerDto.address,
        profile_image: registerDto.profile_image,
      });
      userType = UserRole.EXPERT;
    } else if (registerDto.user_type === UserRole.FARMER) {
      // Create farmer user in users table
      user = await this.createFarmerUser({
        name: registerDto.name,
        email: registerDto.email,
        password: registerDto.password,
        phone: registerDto.phone,
        address: registerDto.address,
      });
      userType = UserRole.FARMER;
    } else {
      throw new BadRequestException('Invalid user type');
    }

    // Generate JWT token for the new user
    const payload = {
      sub: user.id as string,
      email: user.email as string,
      name: user.name as string,
      user_type: userType,
    };

    const access_token = this.jwtService.sign(payload);

    // Return user data (excluding password) and token
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as Record<string, unknown>,
      access_token,
      type: userType,
    };
  }

  /**
   * Create a new expert user in experts table
   * @param userData - Expert user data
   * @returns Created expert user
   */
  private async createExpertUser(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    profile_image?: string;
  }): Promise<Experts> {
    // Hash the password
    const hashedPassword = await hashPassword(userData.password);

    // Create expert entity
    const expert = this.expertRepository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone,
      address: userData.address,
      profile_image: userData.profile_image,
      user_type: UserRole.EXPERT,
      is_verified: false,
      is_available: true,
      rating: 0.0,
      total_cases: 0,
    });

    return this.expertRepository.save(expert);
  }

  /**
   * Create a new farmer user in users table
   * @param userData - Farmer user data
   * @returns Created farmer user
   */
  private async createFarmerUser(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }): Promise<Users> {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create user entity with farmer type
    const user = await this.usersService.createUser({
      ...userData,
    });

    // Update the user type to farmer
    return this.usersService.updateUser(user.id, {
      user_type: UserRole.FARMER,
    });
  }

  /**
   * Check if email exists in any user table
   * @param email - Email to check
   * @returns True if email exists, false otherwise
   */
  private async checkEmailExists(email: string): Promise<boolean> {
    // Check in users table (admin and farmers)
    const adminUser = await this.usersService.findByEmail(email);
    if (adminUser) return true;

    // Check in experts table
    const expertUser = await this.expertService.findByEmail(email);
    if (expertUser) return true;

    return false;
  }

  /**
   * Authenticate user with email and password
   * @param loginDto - Login credentials
   * @returns Object containing user data and access token
   */
  async login(
    loginDto: LoginDto,
  ): Promise<{ user: Record<string, unknown>; access_token: string }> {
    const user = await this.findUserByEmail(loginDto.email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      user_type: user.user_type,
    };

    const access_token = this.jwtService.sign(payload);

    // Return user data (excluding password) and token
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as Record<string, unknown>,
      access_token,
    };
  }

  /**
   * Find user by email in both users and experts tables
   * @param email - User email
   * @returns User with password or undefined if not found
   */
  private async findUserByEmail(
    email: string,
  ): Promise<UserWithPassword | undefined> {
    // First check in users table (admin and farmers)
    const user = await this.usersService.findByEmail(email);
    if (user) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
        user_type: user.user_type,
      };
    }

    // Then check in experts table
    const expert = await this.expertService.findByEmail(email);
    if (expert) {
      return {
        id: expert.id,
        email: expert.email,
        name: expert.name,
        password: expert.password,
        user_type: expert.user_type,
      };
    }

    return undefined;
  }

  /**
   * Generate JWT token for user
   * @param user - User data
   * @returns JWT token
   */
  generateToken(user: IUserData): string {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      user_type: user.user_type,
      ...(user.social_provider && { social_provider: user.social_provider }),
      ...(user.social_id && { social_id: user.social_id }),
    };
    return this.jwtService.sign(payload);
  }

  /**
   * Verify JWT token
   * @param token - JWT token
   * @returns Decoded token payload
   */
  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }

  /**
   * Verify password against hashed password
   * @param plainPassword - Plain text password
   * @param hashedPassword - Hashed password
   * @returns True if password matches, false otherwise
   */
  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await comparePasswords(plainPassword, hashedPassword);
  }
}
