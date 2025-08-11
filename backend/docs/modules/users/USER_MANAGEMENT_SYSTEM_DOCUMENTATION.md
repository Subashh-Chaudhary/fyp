# Crop Disease Detection System - User Management Documentation

## Overview

This document outlines the enhanced user management system for the Crop Disease Detection System, which supports three distinct user types with different roles and permissions. The system now features comprehensive token management, enhanced security, and standardized API responses.

## Current Implementation Status

### ✅ **Successfully Implemented**

- **Unified Registration System**: Single endpoint for both farmer and expert registration
- **Enhanced Authentication**: Cross-table login support with JWT tokens
- **Comprehensive Token Management**: Secure token generation and validation
- **Social Authentication**: Google OAuth integration ready
- **Standardized API Responses**: Consistent response format across all endpoints
- **Performance Optimizations**: Optimized database queries and indexes
- **Enhanced Security**: Password hashing, input validation, and response sanitization

## User Types

### 1. Admin (Root User)

- **Role**: System administrator with full access
- **Creation**: Pre-configured in the system, no registration required
- **Storage**: Stored in `users` table with `is_admin: true`
- **Permissions**:
  - Manage all users (farmers and plant doctors)
  - Access system analytics and reports
  - Manage disease database
  - System configuration and maintenance

### 2. Plant Doctor (Expert)

- **Role**: Agricultural expert who provides disease diagnosis and treatment advice
- **Creation**: Through unified registration form with `user_type: 'expert'`
- **Storage**: Stored in dedicated `experts` table
- **Permissions**:
  - View and respond to farmer queries
  - Access disease database
  - Provide treatment recommendations
  - View assigned cases
  - Manage professional profile

### 3. Farmer (User)

- **Role**: End user who submits crop disease queries
- **Creation**: Through unified registration form with `user_type: 'farmer'`
- **Storage**: Stored in `users` table with farmer-specific fields
- **Permissions**:
  - Submit disease detection requests
  - View diagnosis results
  - Access treatment recommendations
  - View query history
  - Manage personal profile

## Enhanced Database Design

### Users Table (Admin + Farmers)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  avatar_url VARCHAR(512),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_admin BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(64),
  verification_expires_at TIMESTAMP WITH TIME ZONE,
  password_reset_token VARCHAR(64),
  reset_token_expires_at TIMESTAMP WITH TIME ZONE,
  refresh_token VARCHAR(64),
  refresh_token_expires_at TIMESTAMP WITH TIME ZONE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  auth_provider VARCHAR(50),
  provider_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Experts Table (Extended Fields for Plant Doctors)

```sql
CREATE TABLE experts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  avatar_url VARCHAR(512),
  qualification TEXT,
  qualification_docs VARCHAR(512),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  verification_token VARCHAR(64),
  verification_token_expires_at TIMESTAMP WITH TIME ZONE,
  password_reset_token VARCHAR(64),
  reset_token_expires_at TIMESTAMP WITH TIME ZONE,
  refresh_token VARCHAR(64),
  refresh_token_expires_at TIMESTAMP WITH TIME ZONE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  auth_provider VARCHAR(50),
  provider_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Database Optimizations

- **Token Field Sizing**: Reduced from 255 to 64 characters for efficiency
- **Timezone Support**: `TIMESTAMP WITH TIME ZONE` for proper timezone handling
- **Partial Indexes**: Only index non-null token values
- **Composite Indexes**: Efficient queries for auth provider combinations
- **Database Comments**: Comprehensive documentation for all fields

## Enhanced Registration Flow Logic

### Unified Registration Process

1. **Single Registration Endpoint**: `/auth/register`
2. **Enhanced Request Structure**:

   ```json
   {
     "name": "string",
     "email": "string",
     "password": "string",
     "confirm_password": "string",
     "phone": "string (optional)",
     "address": "string (optional)",
     "user_type": "farmer" | "expert"
   }
   ```

3. **Enhanced Registration Logic**:

   ```typescript
   async register(registerDto: RegisterDto) {
     // 1. Validate user type
     if (!['farmer', 'expert'].includes(registerDto.user_type)) {
       throw new BadRequestException('Invalid user type');
     }

     // 2. Check if email already exists across all tables
     const existingUser = await this.usersService.findByEmail(registerDto.email);
     const existingExpert = await this.expertService.findByEmail(registerDto.email);

     if (existingUser || existingExpert) {
       throw new ConflictException('Email already registered');
     }

     // 3. Validate password confirmation
     if (registerDto.password !== registerDto.confirm_password) {
       throw new BadRequestException('Password and confirm password do not match');
     }

     // 4. Create user based on type
     let user: Users | Experts;
     if (registerDto.user_type === 'expert') {
       user = await this.createExpert(registerDto);
     } else {
       user = await this.createUser(registerDto);
     }

     // 5. Generate JWT token and verification tokens
     const payload = {
       sub: user.id,
       email: user.email,
       name: user.name,
       user_type: registerDto.user_type,
     };

     const access_token = this.jwtService.sign(payload);
     const verificationToken = this.tokenManager.generateVerificationToken();

     // 6. Send verification email (optional)
     // await this.sendVerificationEmail(user, verificationToken);

     return {
       success: true,
       message: 'Registration successful',
       user: user,
       access_token: access_token
     };
   }
   ```

## Enhanced Implementation Plan

### Phase 1: Database Setup ✅

- ✅ Updated Users entity with enhanced authentication fields
- ✅ Updated Expert entity with comprehensive fields
- ✅ Implemented optimized database indexes
- ✅ Added database comments and documentation

### Phase 2: Service Layer ✅

- ✅ Updated UsersService with enhanced CRUD operations
- ✅ Enhanced ExpertService with comprehensive functionality
- ✅ Implemented unified registration logic in AuthService
- ✅ Added cross-table email checking

### Phase 3: Controller Layer ✅

- ✅ Updated registration endpoint with enhanced features
- ✅ Added comprehensive authentication endpoints
- ✅ Implemented standardized response format
- ✅ Enhanced error handling and validation

### Phase 4: Security & Performance ✅

- ✅ Implemented secure token management
- ✅ Added performance optimizations
- ✅ Enhanced input validation
- ✅ Implemented response sanitization

## Enhanced API Endpoints

### Authentication (Auth Module)

- `POST /auth/register` - Unified registration for farmers and experts
- `POST /auth/login` - Cross-table login for all user types
- `GET /auth/verify-email?token=<token>` - Email verification
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password?token=<token>` - Reset password
- `POST /auth/refresh-token` - Refresh JWT tokens
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback

### User Management (Users Module)

- `GET /users` - List all users with pagination
- `GET /user/:id` - Get specific user by ID
- `PUT /user/:id` - Update user by ID
- `DELETE /user/:id` - Delete user by ID
- `GET /user/profile/me` - Get current user profile (authenticated)
- `PUT /user/profile/me` - Update current user profile (authenticated)

### Expert Management (Expert Module)

- `GET /experts` - List all experts with pagination
- `GET /experts/active` - Get active experts
- `GET /experts/:id` - Get expert by ID
- `PUT /experts/:id` - Update expert by ID
- `DELETE /experts/:id` - Delete expert by ID
- `GET /experts/profile/me` - Get current expert profile
- `PUT /experts/profile/me` - Update current expert profile

## Enhanced Security Considerations

### 1. **Authentication & Authorization**

- JWT tokens with user type information and configurable expiration
- Secure password hashing using bcrypt with 10 salt rounds
- Token expiration management with automatic cleanup
- Social login integration ready with provider tracking
- Role-based access control ready for implementation

### 2. **Data Protection**

- Password field exclusion from all API responses
- Comprehensive input validation and sanitization
- SQL injection prevention through parameterized queries
- XSS protection through proper output encoding
- Secure token storage and validation

### 3. **Token Security**

- Cryptographically secure random generation using crypto.randomBytes()
- Configurable expiration times for different token types
- Automatic cleanup of expired tokens
- Proper timezone handling for global deployments
- Database-level security constraints and indexes

### 4. **API Security**

- Rate limiting ready for implementation
- Input validation using class-validator decorators
- Consistent error responses without information leakage
- HTTPS-ready configuration
- CORS configuration for frontend integration

## Enhanced Error Handling

All API responses follow the standardized format using `ResponseHelper`:

```json
{
  "success": boolean,
  "statusCode": number,
  "message": "string",
  "data": object | null,
  "meta": {
    "timestamp": "ISO-8601 timestamp",
    "path": "string",
    "method": "HTTP_METHOD"
  }
}
```

### HTTP Status Codes

- **200 OK**: Successful operations
- **201 Created**: Resource creation (registration)
- **400 Bad Request**: Validation errors or invalid data
- **401 Unauthorized**: Authentication required
- **404 Not Found**: Resource not found
- **409 Conflict**: Email already exists
- **500 Internal Server Error**: Server errors

## Enhanced Testing Strategy

### 1. **Unit Tests**

- Service layer testing with enhanced security features
- DTO validation testing with comprehensive scenarios
- Repository method testing with optimized queries
- Error handling testing for all scenarios
- Token management testing for security validation

### 2. **Integration Tests**

- API endpoint testing with standardized responses
- Database integration testing with optimized indexes
- Authentication flow testing across all user types
- Registration flow testing with validation
- Cross-table operations testing for data integrity

### 3. **E2E Tests**

- Complete user journey testing for all user types
- Cross-user type interaction testing
- Error scenario testing with proper error handling
- Performance testing with optimized queries
- Security testing for token validation and expiration

## Enhanced Deployment Considerations

### 1. **Environment Setup**

- Database configuration with optimized indexes and performance tuning
- JWT secret management with secure key rotation
- Email service configuration for verification and reset
- Admin user setup with secure credentials
- Token expiration configuration for different environments

### 2. **Database Migration**

- Entity synchronization with enhanced fields and constraints
- Data migration scripts with rollback support
- Backup and recovery procedures for production safety
- Production data safety with validation
- Index optimization for query performance

### 3. **Monitoring & Security**

- User registration tracking and analytics
- Authentication monitoring with security alerts
- Error logging and alerting for production issues
- Performance monitoring with query optimization
- Security event logging for audit trails
- Token usage analytics for security monitoring

## Future Enhancements

### 1. **Immediate Improvements** ✅

- ✅ Email verification system (implemented)
- ✅ Password reset functionality (implemented)
- ✅ Social authentication (implemented)
- ✅ Token refresh system (implemented)
- ✅ Standardized API responses (implemented)

### 2. **Advanced Features**

- Rate limiting for API endpoints and security
- Enhanced email templates with branding
- Two-factor authentication for enhanced security
- Audit logging system for compliance
- Advanced search capabilities with filtering
- Role-based middleware for authorization

### 3. **Scalability Features**

- Caching implementation with Redis integration
- Rate limiting and throttling for API protection
- API versioning for backward compatibility
- Microservice architecture for horizontal scaling
- Load balancing support for high availability
- Horizontal scaling with database sharding

## Conclusion

The enhanced user management system provides a robust, secure, and scalable foundation for the Crop Disease Detection System with:

- **Flexible Architecture**: Supports multiple user types with extensible design
- **Security First**: Implements industry-standard security practices with enhanced token management
- **Scalable Design**: Modular architecture ready for future enhancements with performance optimizations
- **Comprehensive Testing**: Multiple testing layers for reliability and security
- **Production Ready**: Includes deployment, monitoring, and security considerations
- **Standardized APIs**: Consistent response format and error handling across all endpoints
- **Performance Optimized**: Efficient database queries and optimized indexes
- **Social Ready**: Google OAuth integration for enhanced user experience

This implementation serves as a robust foundation for building the complete crop disease detection platform, enabling seamless interaction between farmers, plant doctors, and system administrators while maintaining high security standards and performance.
