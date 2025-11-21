import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experts } from './entities/expert.entity';
import { ExpertController } from './expert.controller';
import { ExpertService } from './expert.service';
import { ExpertRepository } from './repositories';
import { CloudinaryService } from 'src/common/services/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Experts])],
  controllers: [ExpertController],
  providers: [ExpertService, ExpertRepository, CloudinaryService],
  exports: [ExpertService, ExpertRepository, CloudinaryService],
})
export class ExpertModule {}
