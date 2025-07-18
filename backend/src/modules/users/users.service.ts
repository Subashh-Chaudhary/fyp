import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateSocialUserDto, CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Create a new user with email/password
   **/
  private async create(createUserDto: CreateUserDto): Promise<User> {
    // No need to validate here; already validated by ValidationPipe!
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      is_verified: false, // Default to false, email verification needed
    });

    return this.userRepository.save(user);
  }

  public async register(createUserDto: CreateUserDto) {
    return this.create(createUserDto);
  }

  async createSocialUser(
    createSocialUserDto: CreateSocialUserDto,
  ): Promise<User> {
    // No need to validate here; already validated by ValidationPipe!
    const existingUser = await this.userRepository.findOne({
      where: {
        social_provider: createSocialUserDto.social_provider,
        social_id: createSocialUserDto.social_id,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    const emailUser = await this.userRepository.findOne({
      where: { email: createSocialUserDto.email },
    });
    if (emailUser && emailUser.password) {
      throw new ConflictException(
        'Email already registered with password login',
      );
    }

    const user = this.userRepository.create({
      ...createSocialUserDto,
      is_verified: true, // Default to true, social login is verified
    });

    return this.userRepository.save(user);
  }
}
