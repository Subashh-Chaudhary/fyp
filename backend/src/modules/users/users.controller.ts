import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UploadedFiles,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Request as ExpressRequest, Response } from 'express';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { ExpertService } from '../expert/expert.service';

/**
 * Users Controller
 * Handles all user management operations (CRUD)
 * Note: Authentication and registration routes are handled in the auth module
 */
@Controller('')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly expertService: ExpertService,
  ) {}

  /**
   * Get all users with pagination
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @param res - Response object
   * @returns Paginated list of users
   */
  @Get('users')
  async getAllUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Res() res: Response,
  ) {
    const result = await this.usersService.findAll(page, limit);
    const response = ResponseHelper.paginated(
      result.users,
      result.page,
      result.limit,
      result.total,
      'Users retrieved successfully',
      '/users',
      'GET',
    );
    return res.status(response.statusCode).json(response);
  }

  /**
   * Get user by ID
   * @param id - User ID
   * @param res - Response object
   * @returns User details
   */
  @Get('user/:id')
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findById(id);

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    const response = ResponseHelper.success(
      userWithoutPassword,
      'User retrieved successfully',
      HttpStatus.OK,
      `/user/${id}`,
      'GET',
    );
    return res.status(response.statusCode).json(response);
  }

  /**
   * Update user by ID
   * @param id - User ID
   * @param updateUserDto - Update data
   * @param res - Response object
   * @returns Updated user
   */
  @Put('user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.usersService.updateUser(id, updateUserDto);

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    const response = ResponseHelper.success(
      userWithoutPassword,
      'User updated successfully',
      HttpStatus.OK,
      `/user/${id}`,
      'PUT',
    );
    return res.status(response.statusCode).json(response);
  }

  /**
   * Delete user by ID
   * @param id - User ID
   * @param res - Response object
   * @returns Success message
   */
  @Delete('user/:id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    const result = await this.usersService.deleteUser(id);

    const response = ResponseHelper.success(
      result,
      'User deleted successfully',
      HttpStatus.OK,
      `/user/${id}`,
      'DELETE',
    );
    return res.status(response.statusCode).json(response);
  }

  /**
   * Get current user profile
   * @param req - Request object containing user ID from JWT
   * @param res - Response object
   * @returns Current user profile
   */
  @Get('profile')
  async getProfile(
    @Request() req: ExpressRequest & { user: { id: string } },
    @Query('id') id: string,
    @Res() res: Response,
  ) {
    const userId = (req as any)?.user?.id || (req as any)?.user?.sub || id || (req.headers['x-user-id'] as string);
    if (!userId) {
      const response = ResponseHelper.error(
        'Profile retrieval failed',
        'User ID is required',
        HttpStatus.BAD_REQUEST,
        '/profile',
        'GET',
      );
      return res.status(response.statusCode).json(response);
    }
    try {
      const user = await this.usersService.findById(userId);

      // Remove password from response and set user_type for users
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user as any;
      const userWithType = {
        ...userWithoutPassword,
        user_type: (user as any).is_admin ? 'admin' : 'farmer',
      };

      const response = ResponseHelper.success(
        userWithType,
        'Profile retrieved successfully',
        HttpStatus.OK,
        '/profile',
        'GET',
      );
      return res.status(response.statusCode).json(response);
    } catch (e) {
      // If not found in users table, try experts
      if (e instanceof NotFoundException) {
        const expert = await this.expertService.findById(userId);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...expertWithoutPassword } = expert as any;
        const expertWithType = {
          ...expertWithoutPassword,
          user_type: 'expert',
        };

        const response = ResponseHelper.success(
          expertWithType,
          'Profile retrieved successfully',
          HttpStatus.OK,
          '/profile',
          'GET',
        );
        return res.status(response.statusCode).json(response);
      }

      throw e;
    }
  }

  /**
   * Update current user profile
   * @param req - Request object containing user ID from JWT
   * @param updateData - Update data
   * @param res - Response object
   * @returns Updated user profile
   */
  @Put('profile')
  async updateProfile(
    @Request() req: ExpressRequest & { user: { id: string } },
    @Body() updateData: UpdateUserDto,
    @Res() res: Response,
  ) {
    const userId = (req as any)?.user?.id || (req as any)?.user?.sub || (updateData as any)?.id || (req.headers['x-user-id'] as string);
    if (!userId) {
      const response = ResponseHelper.error(
        'Profile update failed',
        'User ID is required',
        HttpStatus.BAD_REQUEST,
        '/profile',
        'PUT',
      );
      return res.status(response.statusCode).json(response);
    }
    const user = await this.usersService.updateUser(userId, updateData);

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    const response = ResponseHelper.success(
      userWithoutPassword,
      'Profile updated successfully',
      HttpStatus.OK,
      '/profile',
      'PUT',
    );
    return res.status(response.statusCode).json(response);
  }

  /**
   * Partially update current user profile (supports name, email, phone, address, is_active)
   */
  @Patch('profile')
  @UseInterceptors(AnyFilesInterceptor({ storage: memoryStorage() }))
  async patchProfile(
    @Request() req: ExpressRequest & { user: { id: string } },
    @Body() updateData: UpdateUserDto,
    @Body('id') rawId: string,
    @Body('userId') altUserId: string,
    @Body('uid') uid: string,
    @Body('user_id') user_id: string,
    @Body('payload') payloadRaw: any,
    @Query('id') queryId: string,
    @Res() res: Response,
  ) {
    // Parse nested JSON payload if present (multipart form-data scenarios)
    let payload: any = payloadRaw;
    if (typeof payloadRaw === 'string') {
      try {
        payload = JSON.parse(payloadRaw);
      } catch {
        payload = undefined;
      }
    }
    if (payload && typeof payload === 'object') {
      updateData = { ...payload, ...updateData } as UpdateUserDto;
    }

    // Resolve user id from multiple possible sources
    const userId =
      (req as any)?.user?.id || (req as any)?.user?.sub ||
      updateData?.id ||
      rawId ||
      altUserId ||
      uid ||
      user_id ||
      queryId ||
      (req.headers['x-user-id'] as string);
    if (!userId) {
      const response = ResponseHelper.error(
        'Profile update failed',
        'User ID is required',
        HttpStatus.BAD_REQUEST,
        '/profile',
        'PATCH',
      );
      return res.status(response.statusCode).json(response);
    }
    let updated: any;
    try {
      updated = await this.usersService.updateUser(userId, updateData);
    } catch (e) {
      if (e instanceof NotFoundException) {
        // If not found in users table, try updating expert profile
        updated = await this.expertService.updateExpert(userId, updateData as any);
      } else {
        throw e;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updated;
    const response = ResponseHelper.success(
      userWithoutPassword,
      'Profile updated successfully',
      HttpStatus.OK,
      '/profile',
      'PATCH',
    );
    return res.status(response.statusCode).json(response);
  }

  /**
   * Upload or replace avatar image for current user (Cloudinary folder 'avatar')
   */
  @Post('profile/avatar')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'file', maxCount: 1 }, // accept legacy/client 'file' field
      ],
      {
        storage: memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
          if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
          }
          cb(null, true);
        },
      },
    ),
  )
  async uploadAvatar(
    @Request() req: ExpressRequest & { user: { id: string } },
    @UploadedFiles()
    files: { avatar?: any[]; file?: any[] },
    @Body() body: any,
    @Res() res: Response,
  ) {
    const file = files?.avatar?.[0] || files?.file?.[0];

    // Debug info: log body keys and headers to help diagnose missing/invalid id
    try {
      // only in dev — lightweight logging
      // eslint-disable-next-line no-console
      console.debug('uploadAvatar: bodyKeys=', Object.keys(body || {}), 'files=', Object.keys(files || {}));
      // eslint-disable-next-line no-console
      console.debug('uploadAvatar: headers x-user-id=', req.headers['x-user-id']);
    } catch (e) {
      // ignore logging errors
    }

    const userId = (req as any)?.user?.id || (req as any)?.user?.sub || body?.id || (req.headers['x-user-id'] as string);

    // Debug: show resolved userId and its type
    // eslint-disable-next-line no-console
    console.debug('uploadAvatar: resolved userId=', userId, 'type=', typeof userId);
    if (!userId) {
      const response = ResponseHelper.error(
        'Avatar update failed',
        'User ID is required',
        HttpStatus.BAD_REQUEST,
        '/profile/avatar',
        'POST',
      );
      return res.status(response.statusCode).json(response);
    }
    let updated: any;
    try {
      updated = await this.usersService.updateAvatar(userId, file);
    } catch (e) {
      if (e instanceof NotFoundException) {
        // try updating expert avatar if user not found in users table
        updated = await this.expertService.updateAvatar(userId, file);
      } else {
        throw e;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updated;
    const response = ResponseHelper.success(
      userWithoutPassword,
      'Avatar updated successfully',
      HttpStatus.OK,
      '/profile/avatar',
      'POST',
    );
    return res.status(response.statusCode).json(response);
  }
}
