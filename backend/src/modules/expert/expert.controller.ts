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
  Query,
  Request,
  Res,
} from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { UpdateExpertDto } from './dtos/update-expert.dto';
import { ExpertService } from './expert.service';

@Controller('')
export class ExpertController {
  constructor(private readonly expertService: ExpertService) {}

  /**
   * Get all experts with pagination
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @param res - Response object
   * @returns Paginated list of experts
   */
  @Get('experts')
  async getAllExperts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Res() res: Response,
  ) {
    const result = await this.expertService.findAll(page, limit);
    const response = ResponseHelper.paginated(
      result.items,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
      'Experts retrieved successfully',
      '/experts',
      'GET',
    );
    return res.status(response.statusCode).json(response);
  }

  /**
   * Get expert by ID
   * @param id - Expert ID
   * @param res - Response object
   * @returns Expert details
   */
  @Get('expert/:id')
  async getExpertById(@Param('id') id: string, @Res() res: Response) {
    const expert = await this.expertService.findById(id);
    const response = ResponseHelper.success(
      expert,
      'Expert retrieved successfully',
      HttpStatus.OK,
      `/expert/${id}`,
      'GET',
    );
    return res.status(response.statusCode).json(response);
  }

  /**
   * Update expert by ID
   * @param id - Expert ID
   * @param updateExpertDto - Update data
   * @param res - Response object
   * @returns Updated expert
   */
  @Put('expert/:id')
  async updateExpert(
    @Param('id') id: string,
    @Body() updateExpertDto: UpdateExpertDto,
    @Res() res: Response,
  ) {
    const expert = await this.expertService.updateExpert(id, updateExpertDto);
    const response = ResponseHelper.success(
      expert,
      'Expert updated successfully',
      HttpStatus.OK,
      `/expert/${id}`,
      'PUT',
    );
    return res.status(response.statusCode).json(response);
  }

  /**
   * Delete expert by ID
   * @param id - Expert ID
   * @param res - Response object
   * @returns Success message
   */
  @Delete('expert/:id')
  async deleteExpert(@Param('id') id: string, @Res() res: Response) {
    const result = await this.expertService.deleteExpert(id);
    const response = ResponseHelper.success(
      result,
      'Expert deleted successfully',
      HttpStatus.OK,
      `/expert/${id}`,
      'DELETE',
    );
    return res.status(response.statusCode).json(response);
  }

  /**
   * Get current expert profile (requires authentication)
   * @param req - Request object with user
   * @param res - Response object
   * @returns Current expert profile
   */
  @Get('expert/profile/me')
  async getProfile(
    @Request() req: ExpressRequest & { user: { id: string } },
    @Res() res: Response,
  ) {
    const expert = await this.expertService.findById(req.user.id);
    const response = ResponseHelper.success(
      expert,
      'Profile retrieved successfully',
      HttpStatus.OK,
      '/expert/profile/me',
      'GET',
    );
    return res.status(response.statusCode).json(response);
  }

  /**
   * Update current expert profile (requires authentication)
   * @param req - Request object with user
   * @param updateData - Update data
   * @param res - Response object
   * @returns Updated expert profile
   */
  @Put('expert/profile/me')
  async updateProfile(
    @Request() req: ExpressRequest & { user: { id: string } },
    @Body() updateData: UpdateExpertDto,
    @Res() res: Response,
  ) {
    const expert = await this.expertService.updateExpert(
      req.user.id,
      updateData,
    );
    const response = ResponseHelper.success(
      expert,
      'Profile updated successfully',
      HttpStatus.OK,
      '/expert/profile/me',
      'PUT',
    );
    return res.status(response.statusCode).json(response);
  }
}
