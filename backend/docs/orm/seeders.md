# Database Seeders

Seeders are scripts that populate your database with initial or test data. They're essential for development, testing, and maintaining consistent data across environments.

## Overview

Seeders provide:

- **Development Setup**: Quick database population for development
- **Testing**: Consistent test data across environments
- **Demo Data**: Sample data for demonstrations
- **Admin Users**: Initial administrative accounts
- **Reference Data**: Lookup tables and configuration data

## Current Seeders

### Admin Seeder

**Location**: `src/database/seeds/admin.seeder.ts`

**Purpose**: Creates default administrative user for system access

**Features**:

- Creates admin user with secure credentials
- Sets up initial authentication
- Runs automatically on application startup
- Configurable admin details

## Seeder Architecture

### Database Provider Integration

The `DatabaseService` automatically runs seeders on application startup:

```typescript
@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    private readonly adminSeeder: AdminSeeder,
  ) {}

  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT 1');
      this.logger.log('✅ Database connection established');

      // Run admin seeder automatically
      await this.adminSeeder.seed();
      this.logger.log('✅ Admin seeder completed');
    } catch (error) {
      // Error handling
    }
  }
}
```

### Seeder Base Structure

```typescript
@Injectable()
export class SeederName {
  constructor(
    private readonly dataSource: DataSource,
    // Add other dependencies as needed
  ) {}

  async seed(): Promise<void> {
    try {
      // Seeding logic here
      this.logger.log('✅ Seeder completed successfully');
    } catch (error) {
      this.logger.error('❌ Seeder failed:', error);
      throw error;
    }
  }
}
```

## Seeder Commands

### Basic Commands

```bash
# Run all seeders
npm run seed:run

# Run specific seeder
npm run seed:run -- -s AdminSeeder

# Revert seeding
npm run seed:revert

# Create new seeder
npm run seed:create -- -n SeederName
```

### TypeORM CLI Commands

```bash
# Run seeders
npm run typeorm -- seed:run

# Run specific seeder
npm run typeorm -- seed:run -- -s SeederName

# Revert seeding
npm run typeorm -- seed:revert
```

## Creating Custom Seeders

### 1. Basic Seeder Template

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CustomSeeder {
  private readonly logger = new Logger(CustomSeeder.name);

  constructor(private readonly dataSource: DataSource) {}

  async seed(): Promise<void> {
    try {
      this.logger.log('🌱 Starting CustomSeeder...');

      // Your seeding logic here
      await this.seedUsers();
      await this.seedCategories();

      this.logger.log('✅ CustomSeeder completed successfully');
    } catch (error) {
      this.logger.error('❌ CustomSeeder failed:', error);
      throw error;
    }
  }

  private async seedUsers(): Promise<void> {
    // Seed user data
  }

  private async seedCategories(): Promise<void> {
    // Seed category data
  }
}
```

### 2. Advanced Seeder with Dependencies

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Users } from '../modules/users/entities/users.entity';
import { Experts } from '../modules/expert/entities/expert.entity';

@Injectable()
export class UserDataSeeder {
  private readonly logger = new Logger(UserDataSeeder.name);

  constructor(private readonly dataSource: DataSource) {}

  async seed(): Promise<void> {
    try {
      this.logger.log('🌱 Starting UserDataSeeder...');

      // Check if data already exists
      if (await this.hasData()) {
        this.logger.log('ℹ️ Data already exists, skipping...');
        return;
      }

      await this.seedUsers();
      await this.seedExperts();

      this.logger.log('✅ UserDataSeeder completed successfully');
    } catch (error) {
      this.logger.error('❌ UserDataSeeder failed:', error);
      throw error;
    }
  }

  private async hasData(): Promise<boolean> {
    const userCount = await this.dataSource.getRepository(Users).count();
    return userCount > 0;
  }

  private async seedUsers(): Promise<void> {
    const userRepository = this.dataSource.getRepository(Users);

    const users = [
      {
        name: 'John Farmer',
        email: 'john@example.com',
        password: 'hashedPassword123',
        phone: '+1234567890',
        is_verified: true,
        is_active: true,
        is_admin: false,
      },
      // Add more users...
    ];

    for (const userData of users) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
    }

    this.logger.log(`✅ Seeded ${users.length} users`);
  }

  private async seedExperts(): Promise<void> {
    const expertRepository = this.dataSource.getRepository(Experts);

    const experts = [
      {
        name: 'Dr. Smith',
        email: 'dr.smith@example.com',
        password: 'hashedPassword123',
        phone: '+1234567890',
        qualification: 'PhD in Agriculture',
        is_verified: true,
        is_active: true,
      },
      // Add more experts...
    ];

    for (const expertData of experts) {
      const expert = expertRepository.create(expertData);
      await expertRepository.save(expert);
    }

    this.logger.log(`✅ Seeded ${experts.length} experts`);
  }
}
```

### 3. Seeder with Data Validation

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { validate } from 'class-validator';
import { CreateUserDto } from '../modules/users/dtos/create-user.dto';

@Injectable()
export class ValidatedUserSeeder {
  private readonly logger = new Logger(ValidatedUserSeeder.name);

  constructor(private readonly dataSource: DataSource) {}

  async seed(): Promise<void> {
    try {
      this.logger.log('🌱 Starting ValidatedUserSeeder...');

      const userData = [
        {
          name: 'Valid User',
          email: 'valid@example.com',
          password: 'SecurePass123!',
          phone: '+1234567890',
        },
        // Add more users...
      ];

      for (const data of userData) {
        await this.seedValidatedUser(data);
      }

      this.logger.log('✅ ValidatedUserSeeder completed successfully');
    } catch (error) {
      this.logger.error('❌ ValidatedUserSeeder failed:', error);
      throw error;
    }
  }

  private async seedValidatedUser(data: any): Promise<void> {
    // Create DTO instance
    const userDto = new CreateUserDto();
    Object.assign(userDto, data);

    // Validate data
    const errors = await validate(userDto);
    if (errors.length > 0) {
      this.logger.warn(`Validation failed for user ${data.email}:`, errors);
      return;
    }

    // Save valid user
    const userRepository = this.dataSource.getRepository(Users);
    const user = userRepository.create(userDto);
    await userRepository.save(user);

    this.logger.log(`✅ Seeded validated user: ${data.email}`);
  }
}
```

## Seeder Best Practices

### 1. Data Management

- **Idempotent**: Seeders should be safe to run multiple times
- **Data Validation**: Validate data before insertion
- **Duplicate Prevention**: Check for existing data before seeding
- **Clean Data**: Use realistic, meaningful test data

### 2. Performance

- **Batch Operations**: Use batch inserts for large datasets
- **Transaction Safety**: Wrap related operations in transactions
- **Memory Management**: Process data in chunks for large seeders
- **Async Operations**: Use async/await properly

### 3. Error Handling

- **Graceful Degradation**: Handle errors without crashing
- **Detailed Logging**: Log all seeding activities
- **Rollback Support**: Support for reverting seeded data
- **Validation Errors**: Handle and log validation failures

### 4. Environment Considerations

- **Environment-Specific**: Different data for different environments
- **Configuration**: Use environment variables for configurable data
- **Sensitive Data**: Never seed production credentials
- **Data Volume**: Adjust data volume based on environment

## Seeder Configuration

### Environment-Based Seeding

```typescript
@Injectable()
export class EnvironmentSeeder {
  async seed(): Promise<void> {
    const environment = process.env.NODE_ENV;

    switch (environment) {
      case 'development':
        await this.seedDevelopmentData();
        break;
      case 'testing':
        await this.seedTestData();
        break;
      case 'production':
        await this.seedProductionData();
        break;
      default:
        this.logger.warn('Unknown environment, skipping seeding');
    }
  }
}
```

### Conditional Seeding

```typescript
@Injectable()
export class ConditionalSeeder {
  async seed(): Promise<void> {
    // Only seed if explicitly requested
    if (process.env.SEED_DATA !== 'true') {
      this.logger.log('ℹ️ Seeding disabled, skipping...');
      return;
    }

    // Check if data already exists
    if (await this.hasData()) {
      this.logger.log('ℹ️ Data already exists, skipping...');
      return;
    }

    await this.performSeeding();
  }
}
```

## Seeder Dependencies

### Managing Seeder Order

```typescript
@Injectable()
export class SeederManager {
  constructor(
    private readonly adminSeeder: AdminSeeder,
    private readonly userSeeder: UserSeeder,
    private readonly expertSeeder: ExpertSeeder,
  ) {}

  async runAllSeeders(): Promise<void> {
    try {
      // Run seeders in dependency order
      await this.adminSeeder.seed();
      await this.userSeeder.seed();
      await this.expertSeeder.seed();

      this.logger.log('✅ All seeders completed successfully');
    } catch (error) {
      this.logger.error('❌ Seeding failed:', error);
      throw error;
    }
  }
}
```

## Testing Seeders

### Unit Testing

```typescript
describe('AdminSeeder', () => {
  let seeder: AdminSeeder;
  let dataSource: DataSource;

  beforeEach(async () => {
    // Setup test database
  });

  it('should seed admin user successfully', async () => {
    await seeder.seed();

    const adminUser = await dataSource
      .getRepository(Users)
      .findOne({ where: { is_admin: true } });

    expect(adminUser).toBeDefined();
    expect(adminUser.email).toBe('admin@example.com');
  });
});
```

### Integration Testing

```typescript
describe('Seeder Integration', () => {
  it('should run all seeders without errors', async () => {
    const seederManager = app.get(SeederManager);

    await expect(seederManager.runAllSeeders()).resolves.not.toThrow();
  });
});
```

## Troubleshooting

### Common Issues

1. **Seeder Already Run**
   - Check if data exists before seeding
   - Implement idempotent seeding logic

2. **Validation Errors**
   - Review data format and constraints
   - Check entity validation rules

3. **Performance Issues**
   - Use batch operations for large datasets
   - Implement proper indexing

4. **Dependency Issues**
   - Ensure proper seeder order
   - Handle missing dependencies gracefully

### Debug Commands

```bash
# Check seeder status
npm run typeorm -- seed:show

# Run specific seeder with verbose logging
npm run typeorm -- seed:run -- -s SeederName --verbose

# Check seeded data
npm run typeorm -- query "SELECT COUNT(*) FROM users"
```

## Production Considerations

1. **Selective Seeding**: Only seed essential data in production
2. **Data Security**: Never seed sensitive or test data
3. **Performance**: Minimize production seeding impact
4. **Monitoring**: Monitor seeding operations in production
5. **Backup**: Create backups before running production seeders
