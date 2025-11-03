import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from '../../common/services/cloudinary.service';
import { MlClientService } from '../../common/services/ml-client.service';
import { Users } from '../users/entities/users.entity';
import { DiseasesModule } from '../diseases/diseases.module';
import { SolutionsModule } from '../solutions/solutions.module';
import { CropsController } from './crops.controller';
import { CropsService } from './crops.service';
import { Crops } from './entities/crop.entity';
import { CropsMlService } from './crops-ml.service';
import { ReportsModule } from '../reports/reports.module';
import { HistoriesModule } from '../histories/histories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Crops, Users]),
    DiseasesModule,
    SolutionsModule,
    ReportsModule,
    HistoriesModule,
  ],
  controllers: [CropsController],
  providers: [CropsService, CloudinaryService, MlClientService, CropsMlService],
  exports: [CropsService, CloudinaryService, MlClientService, CropsMlService],
})
export class CropsModule {}
