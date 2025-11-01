import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from '../../common/services/cloudinary.service';
import { Users } from '../users/entities/users.entity';
import { CropsController } from './crops.controller';
import { CropsService } from './crops.service';
import { Crops } from './entities/crop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Crops, Users])],
  controllers: [CropsController],
  providers: [CropsService, CloudinaryService],
  exports: [CropsService, CloudinaryService],
})
export class CropsModule {}
