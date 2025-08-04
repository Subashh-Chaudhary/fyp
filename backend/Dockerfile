# =============================================================================
# BACKEND DOCKERFILE - NestJS Development Environment
# =============================================================================
# This Dockerfile sets up a development environment for the NestJS backend
# with hot-reload capabilities and proper dependency management

# Use Node.js 18 Alpine as the base image for smaller size and better security
# Alpine Linux is a security-oriented, lightweight Linux distribution
FROM node:18-alpine

# Set working directory inside the container
# All subsequent commands will be executed from this directory
WORKDIR /app

# Install system dependencies required for building native modules
# This includes Python, make, g++, and other build tools
RUN apk add --no-cache \
  python3 \
  make \
  g++ \
  git \
  && rm -rf /var/cache/apk/*

# Copy package.json and package-lock.json first
# This is a Docker best practice for better layer caching
# If only source code changes, npm install won't run again
COPY package*.json ./

# Install all dependencies (including dev dependencies for development)
# Using npm ci for faster, reliable installs in production-like environments
# --legacy-peer-deps is used to handle peer dependency conflicts
RUN npm ci --legacy-peer-deps

# Copy the rest of the application code
# This includes source files, configuration files, etc.
COPY . .

# Create a non-root user for better security
# Running as root in containers is a security risk
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nestjs -u 1001

# Change ownership of the app directory to the non-root user
RUN chown -R nestjs:nodejs /app

# Switch to the non-root user
USER nestjs

# Expose the port that NestJS will run on
# This is the default port for NestJS applications
EXPOSE 3000

# Set environment variables for development
ENV NODE_ENV=development
ENV PORT=3000

# Start the development server with hot-reload
# --watch flag enables automatic restart on file changes
# --preserveWatchOutput prevents clearing console on restart
CMD ["npm", "run", "dev"]
