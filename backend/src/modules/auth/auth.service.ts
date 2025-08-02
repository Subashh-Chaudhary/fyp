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
import { Repository } from 'typeorm';
import { Users } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

interface IUserData {
  id: number;
  email: string;
  name: string;
  social_provider?: string;
  social_id?: string;
}

interface UserWithPassword {
  id: number;
  email: string;
  name: string;
  password: string;
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
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
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
    // Check if email already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create user in users table
    const user = await this.createUser(registerDto);

    // Generate JWT token for the new user
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
   * Create a new user in users table
   * @param userData - User data
   * @returns Created user
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
      profile_image: userData.profile_image,
      is_verified: false,
    });

    return this.usersRepository.save(user);
  }

  /**
   * Authenticate user with email and password
   * @param loginDto - Login credentials
   * @returns Object containing user data and access token
   */
  async login(
    loginDto: LoginDto,
  ): Promise<{ user: Record<string, unknown>; access_token: string }> {
    // Find user by email
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
      social_provider: user.social_provider,
      social_id: user.social_id,
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
   * Verify password against hash
   * @param plainPassword - Plain text password
   * @param hashedPassword - Hashed password
   * @returns True if password matches, false otherwise
   */
  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return comparePasswords(plainPassword, hashedPassword);
  }
}
