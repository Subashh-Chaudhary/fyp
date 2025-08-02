import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpertController } from './expert.controller';
import { ExpertService } from './expert.service';
import { Experts } from './entities/expert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Experts])],
  controllers: [ExpertController],
  providers: [ExpertService],
  exports: [ExpertService],
})
export class ExpertModule {}
