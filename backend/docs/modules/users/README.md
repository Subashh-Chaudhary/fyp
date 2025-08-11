# Users Module Documentation

This directory contains all documentation related to the Users module functionality.

## Available Documentation

### Implementation Documentation

- **[USER_CRUD_IMPLEMENTATION_SUMMARY.md](./USER_CRUD_IMPLEMENTATION_SUMMARY.md)** - Summary of CRUD operations implementation for users
- **[USER_MANAGEMENT_SUMMARY.md](./USER_MANAGEMENT_SUMMARY.md)** - Overview of user management features and functionality
- **[USER_MANAGEMENT_SYSTEM_DOCUMENTATION.md](./USER_MANAGEMENT_SYSTEM_DOCUMENTATION.md)** - Comprehensive documentation of the user management system
- **[UPDATED_IMPLEMENTATION_SUMMARY.md](./UPDATED_IMPLEMENTATION_SUMMARY.md)** - Summary of recent updates to the user management implementation

## Module Overview

The Users module handles:

- **User CRUD Operations**: Create, read, update, delete operations for users
- **User Profile Management**: Profile updates and management
- **User Authentication Support**: Social login integration
- **Admin User Management**: Administrative user operations
- **Farmer User Management**: Agricultural user operations

## Current Implementation Features

### 1. **Simplified Architecture**

- Farmers and admins share the same `users` table
- No complex JOINs for farmer queries
- Direct CRUD operations for better performance

### 2. **Core CRUD Operations**

- `GET /users` - Get all users with pagination
- `GET /user/:id` - Get user by ID
- `PUT /user/:id` - Update user by ID
- `DELETE /user/:id` - Delete user by ID

### 3. **Profile Management**

- `GET /user/profile/me` - Get current user profile (authenticated)
- `PUT /user/profile/me` - Update current user profile (authenticated)

### 4. **Social Authentication Support**

- Google OAuth integration
- Social user creation and management
- Provider-specific user ID tracking

## User Types Supported

### **Admin Users**

- System administrators with full access
- Stored in `users` table with `is_admin: true`
- Pre-configured, no registration required

### **Farmer Users**

- Agricultural producers
- Stored in `users` table with farmer-specific fields
- Created through unified registration in auth module

## Database Structure

The `users` table includes:

- Basic user fields (name, email, password, phone, address)
- Authentication fields (verification tokens, reset tokens, refresh tokens)
- Social login support (auth_provider, provider_id)
- Admin flag (is_admin)
- Timestamps (created_at, updated_at)

## Related Modules

- **Auth Module**: Handles authentication and registration
- **Expert Module**: Manages expert-specific functionality
- **Common Module**: Shared utilities and interfaces

## Quick Links

- [Users Controller](../users.controller.ts)
- [Users Service](../users.service.ts)
- [Users Entity](../entities/users.entity.ts)
- [Users DTOs](../dtos/)
- [Users Repository](../repositories/users.repository.ts)

## Important Notes

- **Registration**: User registration is handled by the Auth module, not this module
- **User Types**: This module manages both admin and farmer users
- **Expert Users**: Expert users are managed by the Expert module
- **Authentication**: All authentication logic is centralized in the Auth module

## Security Features

- **Password Security**: Passwords are hashed using bcrypt
- **Response Sanitization**: Passwords are excluded from all API responses
- **Input Validation**: Comprehensive validation using class-validator
- **Email Uniqueness**: Prevents duplicate email addresses
- **Authentication Required**: Profile operations require valid authentication
