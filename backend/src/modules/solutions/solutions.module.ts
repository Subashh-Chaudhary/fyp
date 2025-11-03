import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solutions } from './entities/solution.entity';
import { SolutionsService } from './solutions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Solutions])],
  providers: [SolutionsService],
  exports: [SolutionsService, TypeOrmModule],
})
export class SolutionsModule {}
