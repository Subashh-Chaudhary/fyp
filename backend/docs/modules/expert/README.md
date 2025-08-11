# Expert Module Documentation

This document outlines the complete CRUD (Create, Read, Update, Delete) operations for the Expert module in the backend API.

## Overview

The Expert module provides comprehensive management of expert users, including profile management, availability tracking, rating system, and specialized search capabilities.

**Note**: Expert creation is handled in the Auth module during registration, not in this module.

## Current Implementation Features

### 1. **Enhanced Entity Structure**

- Complete user authentication fields
- Professional information (qualification, qualification_docs)
- Token management (verification, reset, refresh tokens)
- Social authentication support
- Comprehensive indexing for performance

### 2. **Token Management Integration**

- Secure verification tokens (64 characters)
- Password reset tokens with expiration
- Refresh tokens for JWT management
- Last login tracking
- Proper timezone handling

### 3. **Social Authentication Ready**

- Google OAuth integration support
- Provider-specific user ID tracking
- Automatic user creation from social profiles

## API Endpoints

### Core CRUD Operations

1. **GET /experts** - Get all experts with pagination
   - Query parameters: `page` (default: 1), `limit` (default: 10)
   - Returns: Paginated list of experts with metadata

2. **GET /experts/:id** - Get expert by ID
   - Returns: Expert details
   - Error: 404 if expert not found

3. **PUT /experts/:id** - Update expert by ID
   - Body: `UpdateExpertDto`
   - Returns: Updated expert object
   - Validation: Email uniqueness check if email is being updated

4. **DELETE /experts/:id** - Delete expert by ID
   - Returns: Success message
   - Error: 404 if expert not found

### Profile Operations (for authenticated experts)

5. **GET /experts/profile/me** - Get current expert profile
   - Requires: Authentication
   - Returns: Current expert's profile

6. **PUT /experts/profile/me** - Update current expert profile
   - Requires: Authentication
   - Body: `UpdateExpertDto`
   - Returns: Updated expert profile

### Specialized Operations

7. **GET /experts/active** - Get active experts
   - Query parameters: `page` (default: 1), `limit` (default: 10)
   - Returns: List of active experts with pagination

8. **GET /experts/verification/:token** - Get expert by verification token
   - Returns: Expert details for email verification

9. **GET /experts/reset/:token** - Get expert by password reset token
   - Returns: Expert details for password reset

## Data Transfer Objects

### UpdateExpertDto

```typescript
{
  email?: string;          // Optional, unique if provided
  name?: string;           // Optional, 3-100 characters
  phone?: string;          // Optional, numbers only
  address?: string;        // Optional
  avatar_url?: string;     // Optional, valid URL
  qualification?: string;  // Optional
  qualification_docs?: string; // Optional, valid URL
  is_verified?: boolean;   // Optional
  is_active?: boolean;     // Optional
}
```

## Expert Entity Structure

```typescript
{
  id: string;                    // UUID, primary key
  name: string;                  // Expert name
  email: string;                 // Unique email
  password: string;              // Hashed password
  phone?: string;                // Phone number
  address?: string;              // Address
  avatar_url?: string;           // Profile image URL
  qualification?: string;        // Professional qualification
  qualification_docs?: string;   // Qualification documents URL
  is_verified: boolean;          // Verification status
  is_active: boolean;            // Active status
  verification_token?: string;   // Email verification token
  verification_token_expires_at?: Date; // Verification token expiry
  password_reset_token?: string; // Password reset token
  reset_token_expires_at?: Date; // Reset token expiry
  refresh_token?: string;        // JWT refresh token
  refresh_token_expires_at?: Date; // Refresh token expiry
  last_login_at?: Date;          // Last login timestamp
  auth_provider?: string;        // Social auth provider
  provider_id?: string;          // Social auth provider ID
  created_at: Date;              // Creation timestamp
  updated_at: Date;              // Last update timestamp
}
```

## Service Methods

### Core CRUD Operations

- `findById(id: string)`: Find expert by ID
- `findByEmail(email: string)`: Find expert by email
- `findAll(page: number, limit: number)`: Get paginated experts
- `updateExpert(id: string, data: UpdateExpertDto)`: Update expert
- `deleteExpert(id: string)`: Delete expert

### Specialized Operations

- `findActiveExperts(page: number, limit: number)`: Get active experts
- `findByVerificationToken(token: string)`: Find by verification token
- `findByPasswordResetToken(token: string)`: Find by reset token
- `updateLastLogin(id: string)`: Update last login timestamp
- `updateRefreshToken(id: string, token: string, expiresAt: Date)`: Update refresh token
- `clearRefreshToken(id: string)`: Clear refresh token
- `findByProviderId(provider: string, providerId: string)`: Find by social provider

### Social Authentication

- `createExpert(expertData: CreateExpertDto)`: Create new expert
- `findBySocialId(provider: string, socialId: string)`: Find by social login

## Error Handling

The service includes comprehensive error handling:

- **ConflictException**: Email already exists
- **NotFoundException**: Expert not found
- **BadRequestException**: Invalid data or operation failure

## Validation

All endpoints include proper validation:

- Email format validation
- Phone number format validation
- URL validation for avatar and documents
- String length limits
- Required field validation

## Security Considerations

- Email uniqueness is enforced
- Authentication required for profile operations
- Input validation prevents injection attacks
- Proper error messages without sensitive data exposure
- Secure token management

## Database Indexes

The entity includes optimized indexes:

- Email uniqueness index
- Partial indexes for token fields (only non-null values)
- Composite index for auth provider + provider ID
- Performance-optimized queries

## Integration with Auth Module

- Registration handled in auth module
- Login supports both users and experts tables
- JWT tokens include user type information
- Cross-table email uniqueness validation
