import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('predict')
  @UseInterceptors(FileInterceptor('image'))
  async predict(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No image file uploaded.');
    const base64 = file.buffer.toString('base64');
    const result = await this.aiService.predict(base64);
    return result;
  }
}
