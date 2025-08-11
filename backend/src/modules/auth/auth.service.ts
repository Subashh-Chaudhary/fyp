// src/auth/auth.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  comparePasswords,
  hashPassword,
} from 'src/common/helpers/password.helper';
import { IUserData, UserWithPassword } from 'src/common/interfaces';
import { Repository } from 'typeorm';
import { Experts } from '../expert/entities/expert.entity';
import { ExpertService } from '../expert/expert.service';
import { Users } from '../users/entities/users.entity';
import { UsersRepository } from '../users/repositories/users.repository';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

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
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Experts)
    private expertsRepository: Repository<Experts>,
    private readonly usersRepo: UsersRepository,
  ) {}

  /**
   * Register a new user
   * @param registerDto - Registration data
   * @returns Object containing user data and access token
   */
  async register(registerDto: RegisterDto): Promise<{
    user: Record<string, unknown>;
    access_token: string;
  }> {
    // Check if email already exists in both tables
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    const existingExpert = await this.expertService.findByEmail(
      registerDto.email,
    );

    if (registerDto.user_type === 'expert') {
      if (existingExpert) {
        throw new ConflictException('Expert with this email already exists');
      }
    }

    if (registerDto.user_type === 'farmer') {
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    if (registerDto.password !== registerDto.confirm_password) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }

    let user: Users | Experts;

    // Create user based on user_type
    if (registerDto.user_type === 'expert') {
      user = await this.createExpert(registerDto);
    } else {
      user = await this.createUser(registerDto);
    }

    // Generate JWT token for the new user
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      user_type: registerDto.user_type,
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
   * Create a new user (farmer)
   * @param userData - User registration data
   * @returns Created user object
   */
  private async createUser(userData: RegisterDto): Promise<Users> {
    // Hash the password
    const hashedPassword = await hashPassword(userData.password);

    // Create user entity
    const user = this.usersRepository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone,
      address: userData.address,
      avatar_url: userData.avatar_url,
      is_verified: false,
    });

    return this.usersRepository.save(user);
  }

  /**
   * Create a new expert
   * @param userData - Expert registration data
   * @returns Created expert object
   */
  private async createExpert(userData: RegisterDto): Promise<Experts> {
    // Hash the password
    const hashedPassword = await hashPassword(userData.password);

    // Create expert entity
    const expert = this.expertsRepository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone,
      address: userData.address,
      avatar_url: userData.avatar_url,
      is_verified: false,
      is_active: true,
    });

    return this.expertsRepository.save(expert);
  }

  /**
   * Authenticate user with email and password
   * @param loginDto - Login credentials
   * @returns Object containing user data and access token
   */
  async login(
    loginDto: LoginDto,
  ): Promise<{ user: Record<string, unknown>; access_token: string }> {
    // Find user by email in both tables
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

    // Update last login time for experts
    if (user.id && (await this.expertService.findByEmail(loginDto.email))) {
      await this.expertService.updateLastLogin(String(user.id));
    }

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
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
   * Find user by email across all user tables
   * @param email - Email to search for
   * @returns User with password or undefined
   */
  private async findUserByEmail(
    email: string,
  ): Promise<UserWithPassword | undefined> {
    // Check in users table
    const user = await this.usersService.findByEmail(email);
    if (user) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
      };
    }

    // Check in experts table
    const expert = await this.expertService.findByEmail(email);
    if (expert) {
      return {
        id: expert.id,
        email: expert.email,
        name: expert.name,
        password: expert.password,
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
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Verify JWT token
   * @param token - JWT token to verify
   * @returns Decoded token payload
   */
  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new BadRequestException('Invalid token');
    }
  }

  /**
   * Verify password against hashed password
   * @param plainPassword - Plain text password
   * @param hashedPassword - Hashed password
   * @returns Boolean indicating if password is valid
   */
  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return comparePasswords(plainPassword, hashedPassword);
  }
}
