# TypeORM Database Management

This directory contains comprehensive documentation for TypeORM database management in the FYP backend project.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Documentation Sections](#documentation-sections)
4. [Architecture](#architecture)
5. [Best Practices](#best-practices)

## Overview

TypeORM is the primary Object-Relational Mapping (ORM) solution used in this project. It provides:

- **Type Safety**: Full TypeScript support with type-safe database operations
- **Entity-Based Design**: Clean, object-oriented approach to database modeling
- **Migration Support**: Version-controlled database schema changes
- **Query Builder**: Powerful and flexible query building capabilities
- **Relationship Management**: Easy handling of complex database relationships
- **Cross-Platform**: Support for multiple database systems (PostgreSQL in our case)

## Quick Start

### Prerequisites

- PostgreSQL database server
- Node.js environment with TypeScript
- Proper environment variables configured

### Basic Commands

```bash
# Check database connection
npm run typeorm -- query "SELECT 1"

# Run migrations
npm run migration:run

# Show migration status
npm run migration:show

# Generate new migration
npm run migration:generate -- -n MigrationName
```

## Documentation Sections

### Core Components

- **[Data Source](./data-source.md)** - Database connection configuration
- **[Entities](./entities.md)** - Database model definitions
- **[Migrations](./migrations.md)** - Database schema versioning
- **[Seeders](./seeders.md)** - Database population scripts

### Advanced Topics

- **[Query Builder](./query-builder.md)** - Advanced query construction
- **[Relationships](./relationships.md)** - Entity relationship management
- **[Performance](./performance.md)** - Optimization and tuning
- **[Troubleshooting](./troubleshooting.md)** - Common issues and solutions

## Architecture

```
src/database/
├── data-source.ts          # Main database configuration
├── database.provider.ts    # Database service provider
├── migrations/             # Database schema migrations
│   ├── 1700000000000-ReorderExpertsTable.ts
│   ├── 1700000000001-UpdateTokenFields.ts
│   └── 1700000000002-ReorderUsersTable.ts
├── seeds/                  # Database seeding scripts
│   └── admin.seeder.ts
└── entities/               # Database model definitions
    ├── users.entity.ts
    └── expert.entity.ts
```

## Best Practices

1. **Always use migrations** for schema changes
2. **Test migrations** in development before production
3. **Keep migrations small** and focused
4. **Use proper indexing** for performance
5. **Implement proper error handling** in database operations
6. **Use transactions** for complex operations
7. **Monitor query performance** in production

## Database Schema

### Current Tables

- **users** - User management (farmers, admins)
- **experts** - Expert user management
- **migrations** - Migration tracking

### Key Features

- UUID primary keys for security
- Comprehensive audit fields (created_at, updated_at)
- Token-based authentication system
- Social authentication support
- Role-based access control

## Getting Help

- Check the [Troubleshooting](./troubleshooting.md) guide
- Review [Performance](./performance.md) optimization tips
- Consult [Migrations](./migrations.md) for schema changes
- Refer to [Seeders](./seeders.md) for data population

## External Resources

- [TypeORM Official Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [NestJS Database Integration](https://docs.nestjs.com/techniques/database)
