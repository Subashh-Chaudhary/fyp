import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/common/helpers/password.helper';
import { Repository } from 'typeorm';
import { CreateSocialUserDto, CreateUserDto } from './dtos/create-user.dto';
import { Users } from './entities/users.entity';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Create a new user with email/password
   **/
  private async create(createUserDto: CreateUserDto): Promise<Users> {
    // No need to validate here; already validated by ValidationPipe!
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await hashPassword(createUserDto.password);

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
  ): Promise<Users> {
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
