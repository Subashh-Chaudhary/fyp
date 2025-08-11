# Backend Documentation

Welcome to the backend documentation for the FYP project. This documentation covers all the modules and components of the backend system.

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Modules](#modules)
4. [TypeORM Database Management](#typeorm-database-management)
5. [API Documentation](#api-documentation)
6. [Testing](#testing)
7. [Deployment](#deployment)

## Overview

This is a NestJS-based backend application with a modular architecture, featuring user management, expert management, and authentication systems.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
DB_SSL=false
NODE_ENV=development
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## Modules

- [Auth Module](./modules/auth/README.md) - Authentication and authorization
- [Users Module](./modules/users/README.md) - User management
- [Expert Module](./modules/expert/README.md) - Expert management

## TypeORM Database Management

### Introduction to TypeORM

TypeORM is an Object-Relational Mapping (ORM) library for TypeScript and JavaScript that simplifies database operations by allowing you to work with database entities as regular JavaScript objects. It supports multiple database systems including PostgreSQL, MySQL, SQLite, and MongoDB.

### Why TypeORM in This System?

TypeORM is implemented in this project for several key reasons:

1. **Type Safety**: Full TypeScript support with type-safe database operations
2. **Entity-Based Design**: Clean, object-oriented approach to database modeling
3. **Migration Support**: Version-controlled database schema changes
4. **Query Builder**: Powerful and flexible query building capabilities
5. **Relationship Management**: Easy handling of complex database relationships
6. **Cross-Platform**: Support for multiple database systems
7. **Active Record & Data Mapper**: Flexible patterns for data access

### Data Source Configuration

The data source is the core configuration that establishes the connection between your application and the database. It's defined in `src/database/data-source.ts`.

#### Key Components:

- **Database Connection**: PostgreSQL connection parameters
- **Entities**: Database models (Users, Experts)
- **Migrations**: Database schema change files
- **Synchronization**: Disabled for production safety
- **Logging**: Development-only database query logging

#### Configuration Details:

```typescript
export const AppDataSource = new DataSource({
  type: 'postgres', // Database type
  host: process.env.DB_HOST, // Database host
  port: parseInt(process.env.DB_PORT), // Database port
  username: process.env.DB_USERNAME, // Database username
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME, // Database name
  entities: [Experts, Users], // Entity classes
  migrations: [__dirname + '/migrations/*{.ts,.js}'], // Migration files
  migrationsTableName: 'migrations', // Migration tracking table
  synchronize: false, // Disabled for safety
  logging: process.env.NODE_ENV === 'development', // Development logging
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});
```

### Database Provider Service

The `DatabaseService` in `src/database/database.provider.ts` manages the database lifecycle and initialization:

- **Connection Management**: Establishes and monitors database connections
- **Seeder Execution**: Automatically runs seeders on application startup
- **Error Handling**: Graceful error handling with detailed logging
- **Lifecycle Management**: Implements `OnModuleInit` for automatic initialization

### Migrations

Migrations are version-controlled database schema changes that allow you to evolve your database structure over time without losing data.

#### What are Migrations?

Migrations are files that contain SQL commands to modify your database schema. They provide:

- **Version Control**: Track database changes over time
- **Rollback Capability**: Revert changes if needed
- **Team Collaboration**: Consistent database structure across environments
- **Production Safety**: Safe deployment of schema changes

#### How Migrations Work in This Project

1. **Migration Files**: Located in `src/database/migrations/`
2. **Naming Convention**: `{timestamp}-{description}.ts`
3. **Up Method**: Applies the migration
4. **Down Method**: Reverts the migration
5. **Execution Order**: Migrations run in timestamp order

#### Current Migrations

1. **1700000000000-ReorderExpertsTable.ts**
   - Reorders columns in the experts table for better organization
   - Creates new table structure and migrates data
   - Rebuilds indexes and constraints

2. **1700000000001-UpdateTokenFields.ts**
   - Updates token field types to VARCHAR(64) for security
   - Adds comprehensive indexes for performance
   - Adds column comments for documentation
   - Handles both Users and Experts tables

3. **1700000000002-ReorderUsersTable.ts**
   - Reorders columns in the users table
   - Ensures consistent structure with experts table
   - Maintains all existing data and relationships

#### Migration Commands

```bash
# Generate a new migration
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

#### Migration Best Practices

1. **Always Test**: Test migrations in development before production
2. **Backup Data**: Create backups before running migrations
3. **Small Changes**: Keep migrations focused and small
4. **Rollback Plan**: Ensure down() method properly reverts changes
5. **Data Preservation**: Never lose data during migrations
6. **Indexing**: Add indexes for performance-critical queries

### Seeders

Seeders are scripts that populate your database with initial or test data. They're essential for:

- **Development Setup**: Quick database population for development
- **Testing**: Consistent test data across environments
- **Demo Data**: Sample data for demonstrations
- **Admin Users**: Initial administrative accounts

#### Current Seeder

**Admin Seeder** (`src/database/seeds/admin.seeder.ts`):

- Creates default admin user
- Sets up initial authentication credentials
- Runs automatically on application startup

#### Seeder Commands

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

### Database Management Commands

#### TypeORM CLI Commands

```bash
# Database connection
npm run typeorm -- query "SELECT version()"

# Schema synchronization (development only)
npm run typeorm -- schema:sync

# Drop database schema
npm run typeorm -- schema:drop

# Generate entity from existing database
npm run typeorm -- entity:create -- -n EntityName

# Run queries
npm run typeorm -- query "SELECT * FROM users LIMIT 5"
```

#### Migration Management

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

### Database Schema Overview

#### Users Table

- **Core Fields**: id, name, email, password, phone, address, avatar_url
- **Status Fields**: is_verified, is_active, is_admin
- **Authentication**: verification_token, password_reset_token, refresh_token
- **Timestamps**: created_at, updated_at, last_login_at
- **Social Auth**: auth_provider, provider_id

#### Experts Table

- **Core Fields**: id, name, email, password, phone, address, avatar_url
- **Professional**: qualification, qualification_docs
- **Status Fields**: is_verified, is_active
- **Authentication**: Same token structure as users
- **Timestamps**: Same timestamp structure as users

### Performance Optimization

#### Indexes

- **Primary Keys**: Automatic indexing on id fields
- **Unique Constraints**: Email uniqueness with indexes
- **Token Indexes**: Partial indexes on authentication tokens
- **Status Indexes**: Indexes on boolean status fields
- **Composite Indexes**: Multi-column indexes for complex queries

#### Query Optimization

- **Selective Loading**: Load only required fields
- **Relationship Loading**: Use relations for efficient joins
- **Pagination**: Implement proper pagination for large datasets
- **Caching**: Consider Redis for frequently accessed data

### Security Considerations

1. **Token Security**: 64-character tokens for enhanced security
2. **Password Hashing**: Secure password storage
3. **SQL Injection**: TypeORM prevents SQL injection attacks
4. **Access Control**: Role-based access control implementation
5. **Audit Logging**: Track database changes and access

### Troubleshooting

#### Common Issues

1. **Connection Failures**
   - Check environment variables
   - Verify database server status
   - Check firewall settings

2. **Migration Errors**
   - Ensure database is accessible
   - Check migration file syntax
   - Verify entity definitions

3. **Performance Issues**
   - Review query execution plans
   - Check index usage
   - Monitor slow queries

#### Debug Commands

```bash
# Enable query logging
NODE_ENV=development npm run start:dev

# Check database connection
npm run typeorm -- query "SELECT 1"

# View table structure
npm run typeorm -- query "\d users"
```

## API Documentation

- [Standardized API Response Format](./common/docs/STANDARDIZED_API_DOCUMENTATION.md)
- [Implementation Guide](./common/docs/IMPLEMENTATION_GUIDE.md)

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Deployment

### Docker

```bash
# Build image
docker build -t backend .

# Run container
docker run -p 3000:3000 backend
```

### Environment Variables

Ensure all required environment variables are set in production:

- Database credentials
- JWT secrets
- API keys
- SSL certificates

For more detailed information about specific modules, please refer to their respective documentation files.
