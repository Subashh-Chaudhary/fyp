# Data Source Configuration

The data source is the core configuration that establishes the connection between your application and the database. It's defined in `src/database/data-source.ts`.

## Overview

The `AppDataSource` is a TypeORM `DataSource` instance that configures:

- Database connection parameters
- Entity definitions
- Migration settings
- Connection options
- Logging configuration

## Configuration Details

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

## Configuration Options

### Database Connection

| Option     | Description          | Default                   | Required |
| ---------- | -------------------- | ------------------------- | -------- |
| `type`     | Database type        | `'postgres'`              | Yes      |
| `host`     | Database server host | `process.env.DB_HOST`     | Yes      |
| `port`     | Database server port | `5432`                    | No       |
| `username` | Database username    | `process.env.DB_USERNAME` | Yes      |
| `password` | Database password    | `process.env.DB_PASSWORD` | Yes      |
| `database` | Database name        | `process.env.DB_NAME`     | Yes      |

### Entity Management

| Option             | Description                     | Default            |
| ------------------ | ------------------------------- | ------------------ |
| `entities`         | Array of entity classes         | `[Experts, Users]` |
| `autoLoadEntities` | Auto-load entities from modules | `false`            |

### Migration Configuration

| Option                | Description                    | Default               |
| --------------------- | ------------------------------ | --------------------- |
| `migrations`          | Migration file patterns        | `['migrations/*.ts']` |
| `migrationsTableName` | Migration tracking table       | `'migrations'`        |
| `migrationsRun`       | Auto-run migrations on startup | `false`               |

### Performance & Safety

| Option        | Description      | Default            | Purpose                            |
| ------------- | ---------------- | ------------------ | ---------------------------------- |
| `synchronize` | Auto-sync schema | `false`            | **Disabled for production safety** |
| `logging`     | Query logging    | `development only` | Performance monitoring             |
| `ssl`         | SSL connection   | `false`            | Secure connections                 |

## Environment Variables

Create a `.env` file in your project root:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name

# SSL Configuration
DB_SSL=false

# Environment
NODE_ENV=development
```

## SSL Configuration

For production environments with SSL:

```typescript
ssl: {
  rejectUnauthorized: false,
  ca: fs.readFileSync('/path/to/ca-certificate.crt'),
  key: fs.readFileSync('/path/to/client-key.pem'),
  cert: fs.readFileSync('/path/to/client-certificate.pem'),
}
```

## Connection Pooling

Add connection pooling for better performance:

```typescript
export const AppDataSource = new DataSource({
  // ... existing config
  extra: {
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
  },
});
```

## Logging Configuration

### Development Logging

```typescript
logging: process.env.NODE_ENV === 'development'
  ? ['query', 'error', 'warn']
  : false;
```

### Custom Logging

```typescript
logging: (query: string, parameters?: any[]) => {
  console.log('Query:', query);
  console.log('Parameters:', parameters);
};
```

## Error Handling

The data source includes built-in error handling:

```typescript
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
```

## Health Checks

Test database connectivity:

```typescript
// Simple health check
const isConnected = await AppDataSource.isInitialized;

// Detailed health check
try {
  await AppDataSource.query('SELECT 1');
  console.log('Database connection healthy');
} catch (error) {
  console.error('Database connection failed:', error);
}
```

## Production Considerations

1. **Disable synchronize**: Always set `synchronize: false`
2. **Use SSL**: Enable SSL for production databases
3. **Connection pooling**: Implement proper connection pooling
4. **Environment variables**: Use secure environment variable management
5. **Monitoring**: Implement database connection monitoring
6. **Backup strategy**: Regular database backups

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check database server status
   - Verify host and port
   - Check firewall settings

2. **Authentication Failed**
   - Verify username and password
   - Check database user permissions
   - Ensure database exists

3. **SSL Issues**
   - Verify SSL certificate paths
   - Check SSL configuration
   - Test SSL connection manually

### Debug Commands

```bash
# Test database connection
npm run typeorm -- query "SELECT version()"

# Check connection status
npm run typeorm -- query "SELECT current_database(), current_user"

# View active connections
npm run typeorm -- query "SELECT * FROM pg_stat_activity"
```

## Best Practices

1. **Environment-based configuration**: Use different configs for dev/staging/prod
2. **Connection validation**: Implement health checks
3. **Error logging**: Log connection errors with context
4. **Graceful degradation**: Handle database unavailability
5. **Security**: Never hardcode credentials
6. **Monitoring**: Track connection metrics and performance
