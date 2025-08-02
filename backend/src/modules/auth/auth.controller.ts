import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { GoogleAuthRequest } from 'src/common/interfaces/auth.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

/**
 * Auth Controller
 * Handles authentication routes including login, registration, and Google OAuth
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new expert user with email and password
   * @param registerDto - User registration data
   * @param req - Request object for path and method
   * @returns JWT token and user data
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Req() req: Request) {
    try {
      const result = await this.authService.register(registerDto);

      return ResponseHelper.success(
        {
          user: result.user,
          access_token: result.access_token,
          type: result.type,
        },
        'User registered successfully',
        HttpStatus.CREATED,
        req.url,
        req.method,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        ResponseHelper.error(
          'Registration failed',
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
          req.url,
          req.method,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Login with email and password
   * @param loginDto - Login credentials
   * @param req - Request object for path and method
   * @returns JWT token and user data
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    try {
      const result = await this.authService.login(loginDto);

      return ResponseHelper.success(
        result,
        'Login successful',
        HttpStatus.OK,
        req.url,
        req.method,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        ResponseHelper.error(
          'Login failed',
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
          req.url,
          req.method,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Initiates Google OAuth flow
   * This route will redirect to Google for authentication
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // This method will not be called directly
    // The AuthGuard will handle the redirect to Google
    return { message: 'Redirecting to Google...' };
  }

  /**
   * Google OAuth callback endpoint
   * Handles the callback from Google after successful authentication
   */
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req: GoogleAuthRequest) {
    try {
      // Generate JWT token for the authenticated user
      const token = this.authService.generateToken({
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        user_type: UserRole.FARMER, // Default to farmer for social auth
        social_provider: req.user.social_provider,
        social_id: req.user.social_id,
      });

      // Return success response with token
      return ResponseHelper.success(
        {
          token,
          user: {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            social_provider: req.user.social_provider,
          },
        },
        'Google authentication successful',
        HttpStatus.OK,
        req.url,
        req.method,
      );
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      throw new HttpException(
        ResponseHelper.error(
          'Authentication failed',
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
          req.url,
          req.method,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
