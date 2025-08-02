import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { UpdateExpertDto } from './dtos/update-expert.dto';
import { ExpertService } from './expert.service';

@Controller('')
export class ExpertController {
  constructor(private readonly expertService: ExpertService) {}

  /**
   * Get all experts with pagination
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @returns Paginated list of experts
   */
  @Get('experts')
  async getAllExperts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.expertService.findAll(page, limit);
  }

  /**
   * Get expert by ID
   * @param id - Expert ID
   * @returns Expert details
   */
  @Get('expert/:id')
  async getExpertById(@Param('id') id: string) {
    return this.expertService.findById(id);
  }

  /**
   * Update expert by ID
   * @param id - Expert ID
   * @param updateExpertDto - Update data
   * @returns Updated expert
   */
  @Put('expert/:id')
  async updateExpert(
    @Param('id') id: string,
    @Body() updateExpertDto: UpdateExpertDto,
  ) {
    return this.expertService.updateExpert(id, updateExpertDto);
  }

  /**
   * Delete expert by ID
   * @param id - Expert ID
   * @returns Success message
   */
  @Delete('expert/:id')
  async deleteExpert(@Param('id') id: string) {
    return this.expertService.deleteExpert(id);
  }

  /**
   * Get current expert profile (requires authentication)
   * @param req - Request object with user
   * @returns Current expert profile
   */
  @Get('expert/profile/me')
  async getProfile(@Request() req: ExpressRequest & { user: { id: string } }) {
    return this.expertService.findById(req.user.id);
  }

  /**
   * Update current expert profile (requires authentication)
   * @param req - Request object with user
   * @param updateData - Update data
   * @returns Updated expert profile
   */
  @Put('expert/profile/me')
  async updateProfile(
    @Request() req: ExpressRequest & { user: { id: string } },
    @Body() updateData: UpdateExpertDto,
  ) {
    return this.expertService.updateExpert(req.user.id, updateData);
  }
  // /**
  //  * Get available experts
  //  * @returns List of available experts
  //  */
  // @Get('expert/available/list')
  // async getAvailableExperts() {
  //   return this.expertService.getAvailableExperts();
  // }

  // /**
  //  * Search experts by specialization
  //  * @param specialization - Expert specialization
  //  * @returns List of experts with matching specialization
  //  */
  // @Get('expert/search/specialization/:specialization')
  // async findBySpecialization(@Param('specialization') specialization: string) {
  //   return this.expertService.findBySpecialization(specialization);
  // }

  // /**
  //  * Get experts by experience range
  //  * @param minYears - Minimum years of experience
  //  * @param maxYears - Maximum years of experience
  //  * @returns List of experts within experience range
  //  */
  // @Get('expert/search/experience')
  // async findByExperienceRange(
  //   @Query('minYears', ParseIntPipe) minYears: number,
  //   @Query('maxYears', ParseIntPipe) maxYears: number,
  // ) {
  //   return this.expertService.findByExperienceRange(minYears, maxYears);
  // }

  // /**
  //  * Get top rated experts
  //  * @param limit - Number of experts to return (default: 10)
  //  * @returns List of top rated experts
  //  */
  // @Get('expert/top-rated/list')
  // async getTopRatedExperts(
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  // ) {
  //   return this.expertService.getTopRatedExperts(limit);
  // }

  // /**
  //  * Update expert availability
  //  * @param id - Expert ID
  //  * @param isAvailable - Availability status
  //  * @returns Updated expert
  //  */
  // @Put('expert/:id/availability')
  // async updateAvailability(
  //   @Param('id') id: string,
  //   @Body() body: { isAvailable: boolean },
  // ) {
  //   return this.expertService.updateAvailability(id, body.isAvailable);
  // }

  // /**
  //  * Update expert rating
  //  * @param id - Expert ID
  //  * @param rating - New rating
  //  * @returns Updated expert
  //  */
  // @Put('expert/:id/rating')
  // async updateRating(
  //   @Param('id') id: string,
  //   @Body() body: { rating: number },
  // ) {
  //   return this.expertService.updateRating(id, body.rating);
  // }
}
