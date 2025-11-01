import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { CreateCropDto, UpdateCropDto } from './dtos';
import { CropsService } from './crops.service';

function imageFileFilter(req: any, file: any, cb: any) {
  if (!file) return cb(null, true);
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed'), false);
  }
  cb(null, true);
}

@Controller('')
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  @Post('crops')
  @UseInterceptors(
    FileInterceptor('image_url', {
      storage: memoryStorage(),
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async createCrop(
    @Body() dto: CreateCropDto,
    @UploadedFile() file: any,
    @Res() res: Response,
  ) {
    const crop = await this.cropsService.create(dto, { file });
    const response = ResponseHelper.created(
      crop,
      'Crop created successfully',
      '/crops',
      'POST',
    );
    return res.status(response.statusCode).json(response);
  }

  @Get('crops')
  async getCrops(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('user_id') user_id: string,
    @Query('disease_id') disease_id: string,
    @Res() res: Response,
  ) {
    const result = await this.cropsService.findAll(page, limit, {
      user_id,
      disease_id,
    });
    const response = ResponseHelper.paginated(
      result.items,
      result.page,
      result.limit,
      result.total,
      'Crops retrieved successfully',
      '/crops',
      'GET',
    );
    return res.status(response.statusCode).json(response);
  }

  @Get('crops/:id')
  async getCropById(@Param('id') id: string, @Res() res: Response) {
    const crop = await this.cropsService.findById(id);
    const response = ResponseHelper.success(
      crop,
      'Crop retrieved successfully',
      HttpStatus.OK,
      `/crops/${id}`,
      'GET',
    );
    return res.status(response.statusCode).json(response);
  }

  @Put('crops/:id')
  @UseInterceptors(
    FileInterceptor('image_url', {
      storage: memoryStorage(),
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async updateCrop(
    @Param('id') id: string,
    @Body() dto: UpdateCropDto,
    @UploadedFile() file: any,
    @Res() res: Response,
  ) {
    const crop = await this.cropsService.update(id, dto, { file });
    const response = ResponseHelper.success(
      crop,
      'Crop updated successfully',
      HttpStatus.OK,
      `/crops/${id}`,
      'PUT',
    );
    return res.status(response.statusCode).json(response);
  }

  @Delete('crops/:id')
  async deleteCrop(@Param('id') id: string, @Res() res: Response) {
    const result = await this.cropsService.delete(id);
    const response = ResponseHelper.success(
      result,
      'Crop deleted successfully',
      HttpStatus.OK,
      `/crops/${id}`,
      'DELETE',
    );
    return res.status(response.statusCode).json(response);
  }
}
