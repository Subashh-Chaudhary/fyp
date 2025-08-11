# Database Migrations

Migrations are version-controlled database schema changes that allow you to evolve your database structure over time without losing data.

## Overview

Migrations provide:

- **Version Control**: Track database changes over time
- **Rollback Capability**: Revert changes if needed
- **Team Collaboration**: Consistent database structure across environments
- **Production Safety**: Safe deployment of schema changes
- **Data Preservation**: Maintain data integrity during schema changes

## How Migrations Work

1. **Migration Files**: Located in `src/database/migrations/`
2. **Naming Convention**: `{timestamp}-{description}.ts`
3. **Up Method**: Applies the migration
4. **Down Method**: Reverts the migration
5. **Execution Order**: Migrations run in timestamp order
6. **Tracking**: TypeORM tracks executed migrations in the `migrations` table

## Current Migrations

### 1. ReorderExpertsTable (1700000000000)

**Purpose**: Reorders columns in the experts table for better organization

**Changes**:

- Creates new table structure with logical column ordering
- Migrates all existing data
- Rebuilds indexes and constraints
- Maintains data integrity

**Key Operations**:

```sql
-- Create new table with correct structure
CREATE TABLE "experts_new" (...);

-- Copy data from old table
INSERT INTO "experts_new" SELECT ... FROM "experts";

-- Drop old table and rename new one
DROP TABLE "experts" CASCADE;
ALTER TABLE "experts_new" RENAME TO "experts";
```

### 2. UpdateTokenFields (1700000000001)

**Purpose**: Updates token field types and adds performance indexes

**Changes**:

- Updates token fields to VARCHAR(64) for enhanced security
- Adds comprehensive indexes for authentication tokens
- Adds column comments for documentation
- Handles both Users and Experts tables

**Key Operations**:

```sql
-- Update column types
ALTER TABLE "experts"
ALTER COLUMN "verification_token" TYPE VARCHAR(64),
ALTER COLUMN "password_reset_token" TYPE VARCHAR(64),
ALTER COLUMN "refresh_token" TYPE VARCHAR(64);

-- Add performance indexes
CREATE INDEX "IDX_experts_verification_token"
ON "experts" ("verification_token")
WHERE "verification_token" IS NOT NULL;
```

### 3. ReorderUsersTable (1700000000002)

**Purpose**: Reorders columns in the users table for consistency

**Changes**:

- Ensures consistent structure with experts table
- Maintains all existing data and relationships
- Rebuilds indexes for optimal performance

## Migration Commands

### Basic Commands

```bash
# Generate a new migration from entity changes
npm run migration:generate -- -n MigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show

# Create empty migration
npm run migration:create -- -n MigrationName
```

### TypeORM CLI Commands

```bash
# Check migration status
npm run typeorm -- migration:show

# Run migrations
npm run typeorm -- migration:run

# Revert migrations
npm run typeorm -- migration:revert

# Generate migration from entity changes
npm run typeorm -- migration:generate -- -n MigrationName
```

## Migration File Structure

### Basic Template

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationName1700000000000 implements MigrationInterface {
  name = 'MigrationName1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Migration logic here
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback logic here
  }
}
```

### Advanced Template with Error Handling

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationName1700000000000 implements MigrationInterface {
  name = 'MigrationName1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      // Migration logic here
      await queryRunner.query(
        `ALTER TABLE "table_name" ADD COLUMN "new_column" VARCHAR(255)`,
      );
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      // Rollback logic here
      await queryRunner.query(
        `ALTER TABLE "table_name" DROP COLUMN "new_column"`,
      );
    } catch (error) {
      console.error('Rollback failed:', error);
      throw error;
    }
  }
}
```

## Migration Best Practices

### 1. Planning

- **Small Changes**: Keep migrations focused and small
- **Backward Compatibility**: Ensure migrations can be rolled back
- **Testing**: Test migrations in development before production
- **Documentation**: Document complex migration logic

### 2. Implementation

- **Data Preservation**: Never lose data during migrations
- **Rollback Safety**: Ensure down() method properly reverts changes
- **Error Handling**: Implement proper error handling and logging
- **Transaction Safety**: Use transactions for complex operations

### 3. Performance

- **Indexing**: Add indexes for performance-critical queries
- **Batch Operations**: Use batch operations for large datasets
- **Minimal Locks**: Minimize table locks during migration
- **Off-Peak Execution**: Run migrations during low-traffic periods

### 4. Safety

- **Backup Strategy**: Create backups before running migrations
- **Staging Environment**: Test migrations in staging first
- **Rollback Plan**: Have a clear rollback strategy
- **Monitoring**: Monitor migration execution and performance

## Common Migration Patterns

### Adding Columns

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE "users"
    ADD COLUMN "new_field" VARCHAR(255) DEFAULT 'default_value'
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE "users"
    DROP COLUMN "new_field"
  `);
}
```

### Modifying Columns

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE "users"
    ALTER COLUMN "email" TYPE VARCHAR(255),
    ALTER COLUMN "email" SET NOT NULL
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE "users"
    ALTER COLUMN "email" TYPE VARCHAR(100),
    ALTER COLUMN "email" DROP NOT NULL
  `);
}
```

### Creating Tables

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    CREATE TABLE "new_table" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "name" VARCHAR(255) NOT NULL,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_new_table" PRIMARY KEY ("id")
    )
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`DROP TABLE "new_table"`);
}
```

### Adding Indexes

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    CREATE INDEX "IDX_table_field"
    ON "table_name" ("field_name")
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    DROP INDEX "IDX_table_field"
  `);
}
```

## Migration Workflow

### Development Workflow

1. **Make Entity Changes**: Modify entity classes
2. **Generate Migration**: `npm run migration:generate -- -n Description`
3. **Review Migration**: Check generated SQL
4. **Test Migration**: Run in development environment
5. **Commit Changes**: Commit migration file with entity changes

### Production Deployment

1. **Backup Database**: Create full database backup
2. **Deploy Code**: Deploy new application version
3. **Run Migrations**: Execute pending migrations
4. **Verify Changes**: Confirm migration success
5. **Monitor Performance**: Watch for any issues

## Troubleshooting

### Common Issues

1. **Migration Already Applied**
   - Check migration status: `npm run migration:show`
   - Verify migration table contents

2. **Migration Fails**
   - Check database connection
   - Review migration SQL syntax
   - Verify entity definitions

3. **Rollback Issues**
   - Ensure down() method is correct
   - Check for data dependencies
   - Verify rollback SQL

### Debug Commands

```bash
# Check migration status
npm run typeorm -- migration:show

# View migration table
npm run typeorm -- query "SELECT * FROM migrations ORDER BY timestamp"

# Test migration manually
npm run typeorm -- query "YOUR_SQL_HERE"
```

## Performance Considerations

### Large Tables

- **Batch Processing**: Process data in chunks
- **Offline Migration**: Consider downtime for large changes
- **Parallel Processing**: Use parallel operations where possible

### Index Management

- **Drop Indexes**: Remove indexes before bulk operations
- **Rebuild Indexes**: Recreate indexes after data changes
- **Partial Indexes**: Use partial indexes for better performance

## Security Considerations

1. **SQL Injection**: Use parameterized queries
2. **Access Control**: Limit migration execution permissions
3. **Audit Logging**: Log all migration activities
4. **Data Encryption**: Encrypt sensitive data during migration
