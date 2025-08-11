# Troubleshooting Guide

This guide covers common issues and their solutions when working with TypeORM in the FYP backend project.

## Common Issues

### 1. Database Connection Problems

#### Connection Refused

**Symptoms**:

- Error: `ECONNREFUSED`
- Application fails to start
- Database connection timeout

**Solutions**:

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if stopped
sudo systemctl start postgresql

# Check PostgreSQL port
sudo netstat -tlnp | grep 5432

# Verify firewall settings
sudo ufw status
```

**Environment Check**:

```bash
# Verify environment variables
echo $DB_HOST
echo $DB_PORT
echo $DB_USERNAME
echo $DB_NAME

# Test connection manually
psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME
```

#### Authentication Failed

**Symptoms**:

- Error: `password authentication failed`
- Error: `role "username" does not exist`

**Solutions**:

```sql
-- Connect as postgres superuser
sudo -u postgres psql

-- Create user if doesn't exist
CREATE USER your_username WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE your_database TO your_username;

-- Verify user exists
\du
```

**Password Reset**:

```sql
-- Reset user password
ALTER USER your_username WITH PASSWORD 'new_password';
```

#### SSL Connection Issues

**Symptoms**:

- Error: `SSL connection required`
- Error: `certificate verify failed`

**Solutions**:

```typescript
// Update data-source.ts for development
ssl: false

// For production with SSL
ssl: {
  rejectUnauthorized: false,
  ca: fs.readFileSync('/path/to/ca-certificate.crt'),
  key: fs.readFileSync('/path/to/client-key.pem'),
  cert: fs.readFileSync('/path/to/client-certificate.pem'),
}
```

### 2. Migration Issues

#### Migration Already Applied

**Symptoms**:

- Error: `QueryFailedError: duplicate key value violates unique constraint`
- Migration appears to run but doesn't apply changes

**Solutions**:

```bash
# Check migration status
npm run migration:show

# View migration table
npm run typeorm -- query "SELECT * FROM migrations ORDER BY timestamp"

# Check if migration was partially applied
npm run typeorm -- query "SELECT column_name FROM information_schema.columns WHERE table_name = 'your_table'"
```

**Manual Fix**:

```sql
-- Check migration table
SELECT * FROM migrations WHERE name = 'MigrationName';

-- If migration exists but changes not applied, manually apply them
-- Or mark migration as not run
DELETE FROM migrations WHERE name = 'MigrationName';
```

#### Migration Fails

**Symptoms**:

- Error during migration execution
- Partial schema changes
- Rollback fails

**Solutions**:

```bash
# Check migration logs
npm run migration:run -- --verbose

# Test migration manually
npm run typeorm -- query "YOUR_SQL_HERE"

# Check entity definitions
npm run typeorm -- entity:show
```

**Recovery Steps**:

1. **Backup current state**: `pg_dump your_database > backup.sql`
2. **Check what was applied**: Review database schema
3. **Fix the issue**: Correct entity or migration
4. **Re-run migration**: `npm run migration:run`

#### Rollback Issues

**Symptoms**:

- `down()` method fails
- Data loss during rollback
- Foreign key constraint violations

**Solutions**:

```typescript
// Ensure down() method is correct
public async down(queryRunner: QueryRunner): Promise<void> {
  try {
    // Always test rollback in development first
    await queryRunner.query(`DROP TABLE IF EXISTS "new_table"`);
  } catch (error) {
    console.error('Rollback failed:', error);
    // Log the error but don't throw to prevent cascading failures
  }
}
```

### 3. Entity Issues

#### Column Type Mismatch

**Symptoms**:

- Error: `column "field" is of type type1 but expression is of type type2`
- Migration generation fails

**Solutions**:

```typescript
// Check entity column types
@Column({ type: 'varchar', length: 255 }) // Explicit type
@Column({ type: 'timestamp with time zone' }) // PostgreSQL specific

// Verify TypeScript types match
name: string; // Should match varchar
created_at: Date; // Should match timestamp
```

**Type Mapping**:

```typescript
// Common PostgreSQL to TypeScript mappings
@Column({ type: 'varchar', length: 255 }) → string
@Column({ type: 'text' }) → string
@Column({ type: 'integer' }) → number
@Column({ type: 'boolean' }) → boolean
@Column({ type: 'timestamp with time zone' }) → Date
@Column({ type: 'jsonb' }) → Record<string, any>
```

#### Relationship Issues

**Symptoms**:

- Error: `relation "table" does not exist`
- Foreign key constraint violations
- Circular dependency errors

**Solutions**:

```typescript
// Check entity imports
import { Users } from '../users/entities/users.entity';
import { Orders } from '../orders/entities/orders.entity';

// Verify relationship decorators
@ManyToOne(() => Users, user => user.orders)
@JoinColumn({ name: 'user_id' })
user: Users;

// Check foreign key names
@JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
```

**Common Fixes**:

```typescript
// Fix circular imports
// Use string references for circular relationships
@ManyToOne('Users', 'orders')
user: Users;

// Or use lazy loading
@ManyToOne(() => Users, user => user.orders, { lazy: true })
user: Promise<Users>;
```

### 4. Performance Issues

#### Slow Queries

**Symptoms**:

- Long response times
- High CPU usage
- Database connection timeouts

**Solutions**:

```typescript
// Add proper indexes
@Index(['email'], { unique: true })
@Index(['is_active', 'is_verified'])
@Index(['created_at'])

// Use query optimization
const users = await userRepository.find({
  select: ['id', 'name', 'email'], // Only select needed fields
  where: { is_active: true },
  take: 10, // Limit results
  order: { created_at: 'DESC' }
});
```

**Query Analysis**:

```bash
# Enable query logging
NODE_ENV=development npm run start:dev

# Analyze slow queries
npm run typeorm -- query "EXPLAIN ANALYZE SELECT * FROM users WHERE is_active = true"

# Check index usage
npm run typeorm -- query "SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch FROM pg_stat_user_indexes;"
```

#### Memory Issues

**Symptoms**:

- High memory usage
- Out of memory errors
- Slow application performance

**Solutions**:

```typescript
// Use pagination
const users = await userRepository.find({
  skip: (page - 1) * limit,
  take: limit,
});

// Use streaming for large datasets
const userStream = userRepository.createQueryBuilder('user').stream();

// Process in chunks
const chunkSize = 1000;
for (let i = 0; i < total; i += chunkSize) {
  const chunk = await userRepository.find({
    skip: i,
    take: chunkSize,
  });
  // Process chunk
}
```

### 5. Validation Issues

#### Class Validator Errors

**Symptoms**:

- Validation fails during entity creation
- DTO validation errors
- Unexpected validation behavior

**Solutions**:

```typescript
// Check validation decorators
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

@Entity('users')
export class Users {
  @Column({ type: 'varchar', length: 255 })
  @IsString()
  @MinLength(2)
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsEmail()
  email: string;
}
```

**Validation Testing**:

```typescript
// Test validation manually
import { validate } from 'class-validator';

const user = new Users();
user.name = 'John';
user.email = 'invalid-email';

const errors = await validate(user);
console.log('Validation errors:', errors);
```

### 6. Seeder Issues

#### Seeder Already Run

**Symptoms**:

- Duplicate data
- Seeder errors
- Inconsistent data state

**Solutions**:

```typescript
// Check if data exists before seeding
private async hasData(): Promise<boolean> {
  const count = await this.dataSource
    .getRepository(Users)
    .count();
  return count > 0;
}

// Make seeders idempotent
async seed(): Promise<void> {
  if (await this.hasData()) {
    this.logger.log('ℹ️ Data already exists, skipping...');
    return;
  }
  // Perform seeding
}
```

#### Seeder Dependencies

**Symptoms**:

- Foreign key constraint violations
- Missing related data
- Seeder execution order issues

**Solutions**:

```typescript
// Manage seeder order
@Injectable()
export class SeederManager {
  async runAllSeeders(): Promise<void> {
    // Run in dependency order
    await this.adminSeeder.seed();
    await this.userSeeder.seed();
    await this.expertSeeder.seed();
  }
}
```

## Debug Commands

### Database Connection

```bash
# Test connection
npm run typeorm -- query "SELECT 1"

# Check connection status
npm run typeorm -- query "SELECT current_database(), current_user, version()"

# View active connections
npm run typeorm -- query "SELECT * FROM pg_stat_activity WHERE state = 'active'"
```

### Schema Information

```bash
# List all tables
npm run typeorm -- query "\dt"

# Describe table structure
npm run typeorm -- query "\d users"

# Check indexes
npm run typeorm -- query "SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'users'"

# View constraints
npm run typeorm -- query "SELECT conname, contype, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'users'::regclass"
```

### Migration Status

```bash
# Check migration status
npm run migration:show

# View migration table
npm run typeorm -- query "SELECT * FROM migrations ORDER BY timestamp"

# Check applied migrations
npm run typeorm -- query "SELECT name, timestamp FROM migrations WHERE name LIKE '%MigrationName%'"
```

### Performance Analysis

```bash
# Enable query logging
NODE_ENV=development npm run start:dev

# Analyze query performance
npm run typeorm -- query "EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM users WHERE is_active = true"

# Check table statistics
npm run typeorm -- query "SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del FROM pg_stat_user_tables;"
```

## Error Code Reference

### Common PostgreSQL Errors

| Error Code | Description                      | Solution                      |
| ---------- | -------------------------------- | ----------------------------- |
| `23505`    | Unique constraint violation      | Check for duplicate data      |
| `23503`    | Foreign key constraint violation | Verify related data exists    |
| `42P01`    | Undefined table                  | Check table name and schema   |
| `42703`    | Undefined column                 | Verify column exists in table |
| `42804`    | Data type mismatch               | Check column types            |
| `23514`    | Check constraint violation       | Review constraint rules       |

### TypeORM Errors

| Error Type            | Description                    | Solution                               |
| --------------------- | ------------------------------ | -------------------------------------- |
| `QueryFailedError`    | SQL query execution failed     | Check SQL syntax and constraints       |
| `EntityNotFoundError` | Entity not found in database   | Verify entity exists and is accessible |
| `CannotConnectError`  | Database connection failed     | Check connection parameters            |
| `OptimisticLockError` | Version conflict during update | Handle concurrent updates              |

## Prevention Strategies

### 1. Development Best Practices

- **Always test migrations** in development first
- **Use version control** for all database changes
- **Implement proper error handling** in all database operations
- **Monitor query performance** during development

### 2. Testing Strategy

- **Unit test entities** and their methods
- **Integration test** database operations
- **Test migrations** with sample data
- **Validate seeders** in test environment

### 3. Monitoring and Logging

- **Log all database operations** in development
- **Monitor query performance** in production
- **Track migration execution** and results
- **Alert on database errors** in production

### 4. Backup and Recovery

- **Regular database backups** before migrations
- **Test recovery procedures** regularly
- **Document rollback procedures** for each migration
- **Version control** all database changes

## Getting Help

### Internal Resources

1. **Check this troubleshooting guide** for common issues
2. **Review migration files** for similar problems
3. **Check entity definitions** for configuration issues
4. **Review seeder implementations** for data issues

### External Resources

- [TypeORM Official Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [NestJS Database Integration](https://docs.nestjs.com/techniques/database)
- [TypeORM GitHub Issues](https://github.com/typeorm/typeorm/issues)

### When to Escalate

- **Data loss** or corruption
- **Production outages** due to database issues
- **Security vulnerabilities** in database configuration
- **Performance issues** affecting user experience
