// src/auth/services/social-auth.service.ts
import { Injectable } from '@nestjs/common';
import { CreateSocialUserDto } from 'src/modules/users/dtos/create-user.dto';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';

@Injectable()
export class SocialAuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async authenticate(profile: CreateSocialUserDto) {
    // Check if social user exists
    const user = await this.usersRepository.findBySocialId(
      profile.social_provider,
      profile.social_id,
    );

    if (user) return user;

    // Create new social user
    return this.usersRepository.createSocialUser(profile);
  }
}
