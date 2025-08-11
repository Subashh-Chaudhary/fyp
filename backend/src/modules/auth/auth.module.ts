import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenManagerService } from 'src/common/services/token-manager.service';
import { Experts } from '../expert/entities/expert.entity';
import { ExpertModule } from '../expert/expert.module';
import { Users } from '../users/entities/users.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google-oauth.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Users, Experts]),
    UsersModule,
    ExpertModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenManagerService, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
