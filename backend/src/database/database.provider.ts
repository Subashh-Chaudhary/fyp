import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger('Database');

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT 1');
      this.logger.log('✅ Database connection established');
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`❌ Database connection failed: ${error.message}`);
      } else {
        this.logger.error('❌ Database connection failed: Unknown error');
      }
      process.exit(1);
    }
  }
}
