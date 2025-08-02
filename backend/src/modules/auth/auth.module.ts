import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experts } from '../expert/entities/expert.entity';
import { ExpertModule } from '../expert/expert.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google-oauth.strategy';

/**
 * Auth Module
 * Handles all authentication-related functionality including Google OAuth
 */
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jaiVei3ae1ongau7uophiin6aezeivoy',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Experts]), // Add this to make Experts repository available
    UsersModule, // Import UsersModule to access UsersRepository and SocialAuthService
    ExpertModule, // Import ExpertModule to access ExpertService
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
