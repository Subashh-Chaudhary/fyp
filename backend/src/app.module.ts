import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config.';
import { envValidationSchema } from './config/env.validation';
import { AuthController } from './modules/auth/auth.controller';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { UsersModule } from './modules/users/users.module';
import { DatabaseService } from './database/database.provider';

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
    AuthModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, DatabaseService],
})
export class AppModule {}
