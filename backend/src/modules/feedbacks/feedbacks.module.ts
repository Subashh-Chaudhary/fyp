import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedbacks } from './entities/feedback.entity';
import { Reports } from '../reports/entities/report.entity';
import { Experts } from '../expert/entities/expert.entity';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Feedbacks, Reports, Experts])],
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
  exports: [FeedbacksService, TypeOrmModule],
})
export class FeedbacksModule {}
