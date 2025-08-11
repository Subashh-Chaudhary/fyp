# Auth Module Documentation

This directory contains all documentation related to the Authentication module functionality.

## Available Documentation

### Implementation Documentation

- **[LOGIN_IMPLEMENTATION.md](./LOGIN_IMPLEMENTATION.md)** - Detailed documentation of login implementation
- **[REGISTRATION_MIGRATION_SUMMARY.md](./REGISTRATION_MIGRATION_SUMMARY.md)** - Summary of registration system migration and updates
- **[TOKEN_MANAGEMENT_BEST_PRACTICES.md](./TOKEN_MANAGEMENT_BEST_PRACTICES.md)** - Comprehensive token management implementation

## Module Overview

The Auth module handles:

- **User Registration**: Unified registration for farmers and experts
- **User Authentication**: Login with JWT tokens
- **Password Management**: Reset and forgot password functionality
- **Email Verification**: Token-based email verification
- **Social Authentication**: Google OAuth integration
- **JWT Token Management**: Access and refresh token handling
- **Token Security**: Secure token generation and validation

## Current Implementation Features

### 1. **Unified Registration System**

- Single endpoint for both farmer and expert registration
- Automatic user type assignment
- Cross-table email uniqueness validation
- JWT token generation upon successful registration

### 2. **Enhanced Authentication**

- Login across both users and experts tables
- Secure password comparison with bcrypt
- JWT token generation with user type information
- Automatic last login tracking

### 3. **Comprehensive Token Management**

- Email verification tokens (24-hour expiry)
- Password reset tokens (1-hour expiry)
- Refresh tokens (7-day expiry)
- Secure token generation using crypto.randomBytes()

### 4. **Social Authentication**

- Google OAuth integration
- Automatic user creation from social profiles
- Provider-specific user ID tracking

## API Endpoints

### Authentication

- `POST /auth/register` - User registration (farmer/expert)
- `POST /auth/login` - User login
- `POST /auth/refresh-token` - Refresh JWT tokens

### Email Verification

- `GET /auth/verify-email?token=<token>` - Verify email address

### Password Management

- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password?token=<token>` - Reset password

### Social Authentication

- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback

## Related Modules

- **Users Module**: Manages user data and profiles (farmers & admins)
- **Expert Module**: Handles expert-specific authentication and data
- **Common Module**: Shared authentication utilities and interfaces

## Quick Links

- [Auth Controller](../auth.controller.ts)
- [Auth Service](../auth.service.ts)
- [Auth DTOs](../dtos/)
- [Social Auth Service](../services/social-auth.service.ts)
- [Google OAuth Strategy](../strategies/google-oauth.strategy.ts)

## Authentication Flow

1. **Registration**: User registers with email/password or social login
2. **Email Verification**: Verification email sent to user (optional)
3. **Login**: User authenticates with credentials
4. **JWT Generation**: Access token generated for authenticated requests
5. **Password Reset**: Secure password reset functionality
6. **Token Refresh**: Automatic token refresh for long-term sessions

## Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **Token Security**: Cryptographically secure random generation
- **JWT Protection**: Configurable expiration and secure signing
- **Input Validation**: Comprehensive validation using class-validator
- **Rate Limiting**: Ready for implementation
- **HTTPS Ready**: Production-ready security configuration
