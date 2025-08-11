# Database Entities

Entities are TypeScript classes that map to database tables. They define the structure, relationships, and behavior of your data models.

## Overview

Entities provide:

- **Table Mapping**: Direct mapping between classes and database tables
- **Type Safety**: Full TypeScript support with type-safe operations
- **Validation**: Built-in validation using decorators
- **Relationships**: Define complex relationships between entities
- **Query Building**: Use entities with TypeORM's query builder
- **Migration Generation**: Automatic migration generation from entity changes

## Current Entities

### Users Entity

**Location**: `src/modules/users/entities/users.entity.ts`

**Purpose**: Manages farmer and admin user accounts

**Key Features**:

- UUID primary key
- Authentication fields (tokens, verification)
- Social authentication support
- Role-based access control
- Comprehensive audit fields

### Experts Entity

**Location**: `src/modules/expert/entities/expert.entity.ts`

**Purpose**: Manages expert user accounts

**Key Features**:

- Professional qualification fields
- Same authentication structure as users
- Expert-specific attributes
- Consistent with user entity design

## Entity Structure

### Basic Entity Template

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('table_name')
export class EntityName {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
```

### Advanced Entity with Relationships

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['is_verified', 'is_active'])
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_admin: boolean;

  // Relationships
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  // Timestamps
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
```

## Entity Decorators

### Table Decorators

```typescript
@Entity('table_name')                    // Specify table name
@Entity('schema.table_name')             // With schema
@Entity('table_name', { orderBy: { id: 'ASC' } }) // With options
```

### Column Decorators

```typescript
@PrimaryGeneratedColumn('uuid')          // UUID primary key
@PrimaryColumn()                         // Custom primary key
@Column()                               // Basic column
@Column({ type: 'varchar', length: 255 }) // With type specification
@Column({ nullable: false, unique: true }) // With constraints
@Column({ default: 'default_value' })   // With default value
@Column({ comment: 'Column description' }) // With comment
```

### Special Column Decorators

```typescript
@CreateDateColumn()                      // Auto-set creation timestamp
@UpdateDateColumn()                      // Auto-update timestamp
@VersionColumn()                         // Version number for optimistic locking
@Generated('uuid')                       // Auto-generated UUID
```

### Index Decorators

```typescript
@Index()                                 // Basic index
@Index(['column1', 'column2'])          // Composite index
@Index(['email'], { unique: true })     // Unique index
@Index(['status'], { where: '"status" = \'active\'' }) // Partial index
```

## Data Types

### PostgreSQL Types

```typescript
// String types
@Column({ type: 'varchar', length: 255 })
@Column({ type: 'text' })
@Column({ type: 'char', length: 10 })

// Numeric types
@Column({ type: 'integer' })
@Column({ type: 'bigint' })
@Column({ type: 'decimal', precision: 10, scale: 2 })
@Column({ type: 'float' })

// Boolean types
@Column({ type: 'boolean' })

// Date types
@Column({ type: 'timestamp' })
@Column({ type: 'timestamp with time zone' })
@Column({ type: 'date' })
@Column({ type: 'time' })

// Binary types
@Column({ type: 'bytea' })

// JSON types
@Column({ type: 'json' })
@Column({ type: 'jsonb' })

// Array types
@Column({ type: 'varchar', array: true })
@Column({ type: 'integer', array: true })
```

### TypeScript Types

```typescript
// Basic types
name: string;
age: number;
isActive: boolean;
createdAt: Date;

// Optional types
description?: string;
metadata?: Record<string, any>;

// Union types
status: 'active' | 'inactive' | 'pending';
role: 'admin' | 'user' | 'moderator';

// Array types
tags: string[];
permissions: Permission[];
```

## Validation

### Class Validator Integration

```typescript
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  @MinLength(2)
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @MinLength(8)
  password?: string;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  is_verified: boolean;
}
```

### Custom Validation

```typescript
import { ValidateIf } from 'class-validator';

@Entity('users')
export class Users {
  // ... other fields

  @ValidateIf((o) => o.auth_provider === 'local')
  @MinLength(8)
  password?: string;

  @ValidateIf((o) => o.auth_provider !== 'local')
  @IsString()
  provider_id?: string;
}
```

## Relationships

### One-to-One

```typescript
@Entity('users')
export class Users {
  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;
}

@Entity('profiles')
export class Profile {
  @OneToOne(() => Users, (user) => user.profile)
  user: Users;
}
```

### One-to-Many

```typescript
@Entity('users')
export class Users {
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}

@Entity('orders')
export class Order {
  @ManyToOne(() => Users, (user) => user.orders)
  @JoinColumn()
  user: Users;
}
```

### Many-to-Many

```typescript
@Entity('users')
export class Users {
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];
}

@Entity('roles')
export class Role {
  @ManyToMany(() => Users, (user) => user.roles)
  users: Users[];
}
```

## Entity Lifecycle

### Lifecycle Events

```typescript
import { Entity, BeforeInsert, BeforeUpdate, AfterLoad } from 'typeorm';

@Entity('users')
export class Users {
  // ... fields

  @BeforeInsert()
  beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updated_at = new Date();
  }

  @AfterLoad()
  afterLoad() {
    // Transform data after loading
    if (this.metadata) {
      this.metadata = JSON.parse(this.metadata as any);
    }
  }
}
```

### Custom Methods

```typescript
@Entity('users')
export class Users {
  // ... fields and methods

  isAdmin(): boolean {
    return this.is_admin === true;
  }

  isVerified(): boolean {
    return this.is_verified === true;
  }

  isActive(): boolean {
    return this.is_active === true;
  }

  getFullName(): string {
    return `${this.first_name} ${this.last_name}`.trim();
  }

  updateLastLogin(): void {
    this.last_login_at = new Date();
  }
}
```

## Query Building

### Basic Queries

```typescript
// Find all users
const users = await userRepository.find();

// Find by criteria
const activeUsers = await userRepository.find({
  where: { is_active: true },
});

// Find one
const user = await userRepository.findOne({
  where: { email: 'user@example.com' },
});
```

### Advanced Queries

```typescript
// With relations
const usersWithOrders = await userRepository.find({
  relations: ['orders', 'profile'],
  where: { is_active: true },
  order: { created_at: 'DESC' },
});

// With select
const userNames = await userRepository.find({
  select: ['id', 'name', 'email'],
  where: { is_verified: true },
});

// With pagination
const users = await userRepository.find({
  skip: 0,
  take: 10,
  order: { created_at: 'DESC' },
});
```

### Query Builder

```typescript
const users = await userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.orders', 'order')
  .where('user.is_active = :active', { active: true })
  .andWhere('order.status = :status', { status: 'completed' })
  .orderBy('user.created_at', 'DESC')
  .getMany();
```

## Migration Integration

### Auto-Generation

```bash
# Generate migration from entity changes
npm run migration:generate -- -n UpdateUserEntity

# Create migration manually
npm run migration:create -- -n AddUserFields
```

### Migration Example

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserEntity1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "phone" VARCHAR(20),
      ADD COLUMN "address" TEXT,
      ADD COLUMN "avatar_url" VARCHAR(512)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "phone",
      DROP COLUMN "address",
      DROP COLUMN "avatar_url"
    `);
  }
}
```

## Best Practices

### 1. Design Principles

- **Single Responsibility**: Each entity should represent one concept
- **Consistent Naming**: Use consistent naming conventions
- **Proper Types**: Choose appropriate data types
- **Validation**: Implement proper validation rules

### 2. Performance

- **Indexing**: Add indexes for frequently queried fields
- **Selective Loading**: Load only required fields
- **Relationship Loading**: Use lazy loading when appropriate
- **Query Optimization**: Optimize complex queries

### 3. Security

- **Input Validation**: Validate all input data
- **Sensitive Data**: Handle sensitive data appropriately
- **Access Control**: Implement proper access control
- **Audit Logging**: Log important data changes

### 4. Maintenance

- **Documentation**: Document complex entities
- **Testing**: Test entity behavior thoroughly
- **Versioning**: Use proper versioning for changes
- **Migration Strategy**: Plan entity changes carefully

## Testing Entities

### Unit Testing

```typescript
describe('Users Entity', () => {
  let user: Users;

  beforeEach(() => {
    user = new Users();
    user.name = 'Test User';
    user.email = 'test@example.com';
  });

  it('should create user with required fields', () => {
    expect(user.name).toBe('Test User');
    expect(user.email).toBe('test@example.com');
  });

  it('should have default values', () => {
    expect(user.is_verified).toBe(false);
    expect(user.is_active).toBe(true);
  });
});
```

### Integration Testing

```typescript
describe('Users Entity Integration', () => {
  it('should save and retrieve user', async () => {
    const user = userRepository.create({
      name: 'Test User',
      email: 'test@example.com',
    });

    const savedUser = await userRepository.save(user);
    expect(savedUser.id).toBeDefined();

    const retrievedUser = await userRepository.findOne({
      where: { id: savedUser.id },
    });
    expect(retrievedUser.name).toBe('Test User');
  });
});
```

## Troubleshooting

### Common Issues

1. **Column Type Mismatch**
   - Check TypeScript types vs database types
   - Verify migration compatibility

2. **Relationship Issues**
   - Check foreign key constraints
   - Verify relationship decorators

3. **Validation Errors**
   - Review validation decorators
   - Check input data format

4. **Performance Issues**
   - Review indexing strategy
   - Optimize query patterns

### Debug Commands

```bash
# Check entity structure
npm run typeorm -- entity:show

# Generate entity from database
npm run typeorm -- entity:create -- -n EntityName

# Validate entity configuration
npm run typeorm -- schema:log
```
