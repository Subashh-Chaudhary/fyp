import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reports } from './entities/report.entity';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { FeedbacksModule } from '../feedbacks/feedbacks.module';
import { Users } from '../users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reports, Users]), FeedbacksModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService, TypeOrmModule],
})
export class ReportsModule {}
