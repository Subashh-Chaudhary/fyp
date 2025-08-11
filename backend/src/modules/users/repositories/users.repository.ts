import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSocialUserDto } from '../dtos/create-user.dto';
import { Users } from '../entities/users.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async findByEmail(email: string): Promise<Users | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user || undefined;
  }

  async create(userData: Partial<Users>): Promise<Users> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async save(user: Users): Promise<Users> {
    return this.userRepository.save(user);
  }

  async findBySocialId(
    provider: string,
    socialId: string,
  ): Promise<Users | undefined> {
    const user = await this.userRepository.findOne({
      where: { auth_provider: provider, provider_id: socialId },
    });
    return user || undefined;
  }

  async createSocialUser(profile: CreateSocialUserDto): Promise<Users> {
    const user = this.userRepository.create(profile);
    return this.userRepository.save(user);
  }
}
