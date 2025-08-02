import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config.';
import { envValidationSchema } from './config/env.validation';
import { DatabaseService } from './database/database.provider';
import { AuthModule } from './modules/auth/auth.module';
import { ExpertModule } from './modules/expert/expert.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const logger = new Logger('Database');

        try {
          const dbConfig = config.get<TypeOrmModuleOptions>('database');
          if (!dbConfig) throw new Error('Database config not found');

          logger.log('Attempting database connection...');
          return {
            ...dbConfig,
            retryAttempts: 3,
            retryDelay: 3000,
            logging: true,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            logger.error(`Database configuration error: ${error.message}`);
          } else {
            logger.error('Unknown database configuration error');
          }
          throw error;
        }
      },
    }),
    UsersModule,
    ExpertModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
