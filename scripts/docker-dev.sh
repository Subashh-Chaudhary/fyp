#!/bin/bash

# =============================================================================
# Docker Development Helper Script
# =============================================================================
# This script provides convenient commands for managing the Docker development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to check if docker-compose is available
check_docker_compose() {
    if ! command -v docker-compose > /dev/null 2>&1; then
        print_error "docker-compose is not installed. Please install it and try again."
        exit 1
    fi
}

# Function to start all services
start_services() {
    print_status "Starting all services..."
    docker-compose up -d
    print_success "All services started successfully!"
    print_status "Services available at:"
    echo "  - Backend API: http://localhost:3000"
    echo "  - Frontend (Expo): http://localhost:19000"
    echo "  - Database: localhost:5432"
}

# Function to stop all services
stop_services() {
    print_status "Stopping all services..."
    docker-compose down
    print_success "All services stopped successfully!"
}

# Function to restart all services
restart_services() {
    print_status "Restarting all services..."
    docker-compose down
    docker-compose up -d
    print_success "All services restarted successfully!"
}

# Function to rebuild and start services
rebuild_services() {
    print_status "Rebuilding all services..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    print_success "All services rebuilt and started successfully!"
}

# Function to show logs
show_logs() {
    local service=${1:-""}
    if [ -z "$service" ]; then
        print_status "Showing logs for all services..."
        docker-compose logs -f
    else
        print_status "Showing logs for $service..."
        docker-compose logs -f "$service"
    fi
}

# Function to show service status
show_status() {
    print_status "Service status:"
    docker-compose ps
}

# Function to execute command in container
exec_command() {
    local service=$1
    local command=$2

    if [ -z "$service" ] || [ -z "$command" ]; then
        print_error "Usage: $0 exec <service> <command>"
        echo "Available services: backend, frontend, database"
        exit 1
    fi

    print_status "Executing '$command' in $service container..."
    docker-compose exec "$service" sh -c "$command"
}

# Function to clean up everything
cleanup() {
    print_warning "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up everything..."
        docker-compose down -v --rmi all
        docker system prune -a -f
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show help
show_help() {
    echo "Docker Development Helper Script"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  start           Start all services in detached mode"
    echo "  stop            Stop all services"
    echo "  restart         Restart all services"
    echo "  rebuild         Rebuild and start all services"
    echo "  logs [service]  Show logs (all services or specific service)"
    echo "  status          Show service status"
    echo "  exec <service> <command>  Execute command in container"
    echo "  cleanup         Remove all containers, volumes, and images"
    echo "  help            Show this help message"
    echo ""
    echo "Services: backend, frontend, database"
    echo ""
    echo "Examples:"
    echo "  $0 start                    # Start all services"
    echo "  $0 logs backend             # Show backend logs"
    echo "  $0 exec backend npm test    # Run tests in backend"
    echo "  $0 exec database psql -U postgres -d crop_disease_db  # Access database"
}

# Main script logic
main() {
    # Check prerequisites
    check_docker
    check_docker_compose

    # Parse command line arguments
    case "${1:-help}" in
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        rebuild)
            rebuild_services
            ;;
        logs)
            show_logs "$2"
            ;;
        status)
            show_status
            ;;
        exec)
            exec_command "$2" "$3"
            ;;
        cleanup)
            cleanup
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
