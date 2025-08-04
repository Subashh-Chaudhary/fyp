# =============================================================================
# FRONTEND DOCKERFILE - Expo React Native Development Environment
# =============================================================================
# This Dockerfile sets up a development environment for the Expo React Native app
# with Expo CLI, hot-reload, and development tools

# Use Node.js 18 Alpine as the base image
# Expo CLI works best with Node.js 18+ and Alpine provides a lightweight base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Install system dependencies required for Expo and React Native
# This includes Python, make, g++, git, and other build tools
# Also installs curl for health checks and debugging
RUN apk add --no-cache \
  python3 \
  make \
  g++ \
  git \
  curl \
  && rm -rf /var/cache/apk/*

# Install Expo CLI globally
# This provides the 'expo' command for development and building
RUN npm install -g @expo/cli

# Copy package.json and package-lock.json first
# This is a Docker best practice for better layer caching
# If only source code changes, npm install won't run again
COPY package*.json ./

# Install all dependencies
# Using npm ci for faster, reliable installs
# --legacy-peer-deps handles peer dependency conflicts in React Native
RUN npm ci --legacy-peer-deps

# Copy the rest of the application code
# This includes source files, configuration files, assets, etc.
COPY . .

# Create a non-root user for better security
RUN addgroup -g 1001 -S nodejs && \
  adduser -S expo -u 1001

# Change ownership of the app directory to the non-root user
RUN chown -R expo:nodejs /app

# Switch to the non-root user
USER expo

# Ensure the user has write permissions to the app directory
RUN chmod -R 755 /app

# Expose Expo development server ports
# 19000: Expo development server (main)
# 19001: Expo development server (alternate)
# 19002: Expo development server (Metro bundler)
EXPOSE 19000 19001 19002

# Set environment variables for Expo development
ENV NODE_ENV=development
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV EXPO_USE_DEV_SERVER=1

# Health check to ensure the Expo server is running
# This helps Docker determine if the container is healthy
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:19000 || exit 1

# Start the Expo development server
# Using npm start to run the expo start command
CMD ["npm", "start"]
