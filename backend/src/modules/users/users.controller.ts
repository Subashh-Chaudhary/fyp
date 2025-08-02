import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';

/**
 * Users Controller
 * Handles all user management operations (CRUD)
 * Note: Authentication and registration routes are handled in the auth module
 */
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users with pagination
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @param req - Request object for path and method
   * @returns Paginated list of users
   */
  @Get('users')
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Req() req: Request,
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const result = await this.usersService.findAll(pageNum, limitNum);

    return ResponseHelper.paginated(
      result.users,
      result.page,
      result.limit,
      result.total,
      'Users retrieved successfully',
      req.url,
      req.method,
    );
  }

  /**
   * Get users by type (admin, farmer)
   * @param type - User type
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @param req - Request object for path and method
   * @returns Paginated list of users by type
   */
  @Get('users/type/:type')
  async findByType(
    @Param('type') type: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Req() req: Request,
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const result = await this.usersService.findByType(
      type as UserRole,
      pageNum,
      limitNum,
    );

    return ResponseHelper.paginated(
      result.users,
      result.page,
      result.limit,
      result.total,
      `${type} users retrieved successfully`,
      req.url,
      req.method,
    );
  }

  /**
   * Get farmer statistics
   * @param req - Request object for path and method
   * @returns Farmer statistics
   */
  @Get('farmers/statistics')
  async getFarmerStatistics(@Req() req: Request) {
    const statistics = await this.usersService.getFarmerStatistics();

    return ResponseHelper.success(
      statistics,
      'Farmer statistics retrieved successfully',
      HttpStatus.OK,
      req.url,
      req.method,
    );
  }

  /**
   * Update farmer profile
   * @param id - Farmer ID
   * @param updateData - Farmer profile data to update
   * @param req - Request object for path and method
   * @returns Updated farmer user
   */
  @Patch('farmers/:id/profile')
  async updateFarmerProfile(
    @Param('id') id: string,
    @Body() updateData: Partial<Users>,
    @Req() req: Request,
  ) {
    const user = await this.usersService.updateFarmerProfile(id, updateData);

    return ResponseHelper.success(
      user,
      'Farmer profile updated successfully',
      HttpStatus.OK,
      req.url,
      req.method,
    );
  }

  /**
   * Get user statistics
   * @param req - Request object for path and method
   * @returns User statistics
   */
  @Get('users/statistics')
  async getStatistics(@Req() req: Request) {
    const statistics = await this.usersService.getStatistics();

    return ResponseHelper.success(
      statistics,
      'User statistics retrieved successfully',
      HttpStatus.OK,
      req.url,
      req.method,
    );
  }

  /**
   * Get user by ID
   * @param id - User ID
   * @param req - Request object for path and method
   * @returns User object
   */
  @Get('user/:id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const user = await this.usersService.findById(id);

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return ResponseHelper.success(
      userWithoutPassword,
      'User retrieved successfully',
      HttpStatus.OK,
      req.url,
      req.method,
    );
  }

  /**
   * Update user by ID
   * @param id - User ID
   * @param updateData - Data to update
   * @param req - Request object for path and method
   * @returns Updated user object
   */
  @Patch('user/:id')
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateUserDto,
    @Req() req: Request,
  ) {
    const user = await this.usersService.updateUser(id, updateData);

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return ResponseHelper.success(
      userWithoutPassword,
      'User updated successfully',
      HttpStatus.OK,
      req.url,
      req.method,
    );
  }

  /**
   * Delete user by ID
   * @param id - User ID
   * @param req - Request object for path and method
   * @returns Success message
   */
  @Delete('user/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @Req() req: Request) {
    await this.usersService.deleteUser(id);

    return ResponseHelper.noContent(
      'User deleted successfully',
      req.url,
      req.method,
    );
  }
}
