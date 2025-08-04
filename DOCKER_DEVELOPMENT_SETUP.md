# Docker Development Setup

This document describes how to set up and run the Crop Disease Detection System using Docker for local development.

## Overview

The Docker setup includes the following services:

- **Backend**: NestJS API server (Node.js)
- **Frontend**: Expo React Native development server
- **Database**: PostgreSQL database

> **Note**: The AI Model service is not currently dockerized and should be run separately if needed.

## Prerequisites

- Docker and Docker Compose installed
- Git (to clone the repository)

## Quick Start

1. **Clone the repository** (if not already done):

   ```bash
   git clone <repository-url>
   cd fyp
   ```

2. **Start all services**:

   ```bash
   ./scripts/docker-dev.sh start
   ```

3. **Access the services**:
   - Backend API: http://localhost:3000
   - Frontend (Expo): http://localhost:19000
   - Database: localhost:5432

## Available Commands

The `scripts/docker-dev.sh` script provides convenient commands for managing the Docker environment:

```bash
# Start all services
./scripts/docker-dev.sh start

# Stop all services
./scripts/docker-dev.sh stop

# Restart all services
./scripts/docker-dev.sh restart

# Rebuild and start services
./scripts/docker-dev.sh rebuild

# View logs
./scripts/docker-dev.sh logs [service]

# Check service status
./scripts/docker-dev.sh status

# Execute commands in containers
./scripts/docker-dev.sh exec <service> <command>

# Clean up everything
./scripts/docker-dev.sh cleanup

# Show help
./scripts/docker-dev.sh help
```

## Services

### Backend (NestJS)

- **Port**: 3000
- **Hot-reload**: Enabled
- **Database**: Connected to PostgreSQL
- **Environment**: Development mode

### Frontend (Expo)

- **Ports**: 19000, 19001, 19002
- **Hot-reload**: Enabled
- **Tunnel**: Enabled for external access
- **Environment**: Development mode

### Database (PostgreSQL)

- **Port**: 5432
- **Database**: crop_disease_db
- **User**: postgres
- **Password**: password
- **Persistence**: Data persists between restarts

## Development Workflow

1. **Start the environment**:

   ```bash
   ./scripts/docker-dev.sh start
   ```

2. **Make code changes** in your local files - they will be automatically reflected in the containers due to volume mounts.

3. **View logs** if needed:

   ```bash
   ./scripts/docker-dev.sh logs backend
   ./scripts/docker-dev.sh logs frontend
   ```

4. **Execute commands** in containers:

   ```bash
   # Run tests in backend
   ./scripts/docker-dev.sh exec backend npm test

   # Access database
   ./scripts/docker-dev.sh exec database psql -U postgres -d crop_disease_db
   ```

5. **Stop the environment**:
   ```bash
   ./scripts/docker-dev.sh stop
   ```

## Troubleshooting

### Common Issues

1. **Port conflicts**: If ports are already in use, stop the conflicting services or modify the port mappings in `docker-compose.yml`.

2. **Permission issues**: Make sure the script is executable:

   ```bash
   chmod +x scripts/docker-dev.sh
   ```

3. **Docker not running**: Ensure Docker Desktop is running before executing commands.

4. **Build failures**: Try rebuilding the services:
   ```bash
   ./scripts/docker-dev.sh rebuild
   ```

### Logs and Debugging

- View all logs: `./scripts/docker-dev.sh logs`
- View specific service logs: `./scripts/docker-dev.sh logs backend`
- Check service status: `./scripts/docker-dev.sh status`

## AI Model Service

The AI Model service is not currently included in the Docker setup. If you need to run it:

1. Navigate to the `ai-model` directory
2. Install Python dependencies: `pip install -r requirements.txt`
3. Run the service: `python nepali_agricultural_news_service.py`

## Production Considerations

This setup is designed for development. For production:

- Use production Docker images
- Implement proper environment variable management
- Set up proper logging and monitoring
- Configure security settings
- Use production database configurations
- Implement health checks and proper restart policies

## File Structure

```
fyp/
├── docker-compose.yml          # Main Docker Compose configuration
├── scripts/
│   └── docker-dev.sh          # Development helper script
├── backend/
│   └── Dockerfile             # Backend service Dockerfile
├── frontend/
│   └── Dockerfile             # Frontend service Dockerfile
├── database/
│   └── init/                  # Database initialization scripts
└── ai-model/                  # AI Model service (not dockerized)
```
