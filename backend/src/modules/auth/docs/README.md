# Auth Module Documentation

This directory contains all documentation related to the Authentication module functionality.

## Available Documentation

### Implementation Documentation

- **[LOGIN_IMPLEMENTATION.md](./LOGIN_IMPLEMENTATION.md)** - Detailed documentation of login implementation
- **[REGISTRATION_MIGRATION_SUMMARY.md](./REGISTRATION_MIGRATION_SUMMARY.md)** - Summary of registration system migration and updates

## Module Overview

The Auth module handles:

- User authentication (login/logout)
- User registration
- Password management
- Social authentication (Google OAuth)
- JWT token management
- Email verification

## Related Modules

- **Users Module**: Manages user data and profiles
- **Expert Module**: Handles expert-specific authentication
- **Common Module**: Shared authentication utilities

## Quick Links

- [Auth Controller](../auth.controller.ts)
- [Auth Service](../auth.service.ts)
- [Auth DTOs](../dtos/)
- [Social Auth Service](../services/social-auth.service.ts)
- [Google OAuth Strategy](../strategies/google-oauth.strategy.ts)

## Authentication Flow

1. **Registration**: User registers with email/password or social login
2. **Email Verification**: Verification email sent to user
3. **Login**: User authenticates with credentials
4. **JWT Generation**: Access token generated for authenticated requests
5. **Password Reset**: Secure password reset functionality
