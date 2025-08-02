import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST, // TODO: change to env variable
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME, // TODO: change to env variable
    password: process.env.DB_PASSWORD, // TODO: change to env variable
    database: process.env.DB_NAME, // TODO: change to env variable
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false, // Disable auto-synchronization to prevent schema conflicts
    logging: process.env.NODE_ENV === 'development',
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    migrationsRun: process.env.DB_RUN_MIGRATIONS === 'true',
    extra:
      process.env.DB_SSL === 'true'
        ? {
            ssl: { rejectUnauthorized: false },
          }
        : undefined,
  }),
);
