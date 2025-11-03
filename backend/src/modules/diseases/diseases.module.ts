import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diseases } from './entities/disease.entity';
import { DiseasesService } from './diseases.service';

@Module({
  imports: [TypeOrmModule.forFeature([Diseases])],
  providers: [DiseasesService],
  exports: [DiseasesService, TypeOrmModule],
})
export class DiseasesModule {}
