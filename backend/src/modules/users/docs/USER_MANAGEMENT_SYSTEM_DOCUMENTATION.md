# Crop Disease Detection System - User Management Documentation

## Overview

This document outlines the user management system for the Crop Disease Detection System, which supports three distinct user types with different roles and permissions.

## User Types

### 1. Admin (Root User)

- **Role**: System administrator with full access
- **Creation**: Pre-configured in the system, no registration required
- **Permissions**:
  - Manage all users (farmers and plant doctors)
  - Access system analytics and reports
  - Manage disease database
  - System configuration and maintenance

### 2. Plant Doctor (Expert)

- **Role**: Agricultural expert who provides disease diagnosis and treatment advice
- **Creation**: Through unified registration form with `type: 'expert'`
- **Permissions**:
  - View and respond to farmer queries
  - Access disease database
  - Provide treatment recommendations
  - View assigned cases

### 3. Farmer (User)

- **Role**: End user who submits crop disease queries
- **Creation**: Through unified registration form with `type: 'farmer'`
- **Permissions**:
  - Submit disease detection requests
  - View diagnosis results
  - Access treatment recommendations
  - View query history

## Database Design

### Users Table (Common Fields)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  profile_image VARCHAR(512),
  user_type ENUM('farmer', 'expert', 'admin') NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP,
  social_provider VARCHAR(50),
  social_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Experts Table (Extended Fields for Plant Doctors)

```sql
CREATE TABLE experts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  specialization VARCHAR(255),
  experience_years INTEGER,
  qualifications TEXT,
  license_number VARCHAR(100),
  is_available BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_cases INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Farmers Table (Extended Fields for Farmers)

```sql
CREATE TABLE farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  farm_size DECIMAL(10,2),
  farm_type VARCHAR(100),
  location_coordinates POINT,
  preferred_crops TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Registration Flow Logic

### Unified Registration Process

1. **Single Registration Endpoint**: `/auth/register`
2. **Request Body**:

   ```json
   {
     "name": "string",
     "email": "string",
     "password": "string",
     "phone": "string (optional)",
     "address": "string (optional)",
     "user_type": "farmer" | "expert",
     "profile_data": {
       // Expert-specific fields
       "specialization": "string (for experts)",
       "experience_years": "number (for experts)",
       "qualifications": "string (for experts)",
       "license_number": "string (for experts)",

       // Farmer-specific fields
       "farm_size": "number (for farmers)",
       "farm_type": "string (for farmers)",
       "preferred_crops": "array (for farmers)"
     }
   }
   ```

3. **Registration Logic**:

   ```typescript
   async register(registerDto: RegisterDto) {
     // 1. Validate user type
     if (!['farmer', 'expert'].includes(registerDto.user_type)) {
       throw new BadRequestException('Invalid user type');
     }

     // 2. Check if email already exists
     const existingUser = await this.findByEmail(registerDto.email);
     if (existingUser) {
       throw new ConflictException('Email already registered');
     }

     // 3. Create user record
     const user = await this.createUser({
       name: registerDto.name,
       email: registerDto.email,
       password: registerDto.password,
       phone: registerDto.phone,
       address: registerDto.address,
       user_type: registerDto.user_type
     });

     // 4. Create type-specific record
     if (registerDto.user_type === 'expert') {
       await this.createExpert(user.id, registerDto.profile_data);
     } else if (registerDto.user_type === 'farmer') {
       await this.createFarmer(user.id, registerDto.profile_data);
     }

     // 5. Send verification email
     await this.sendVerificationEmail(user);

     return { message: 'Registration successful', user_id: user.id };
   }
   ```

## Implementation Plan

### Phase 1: Database Setup

1. Update Users entity with `user_type` field
2. Create Expert entity
3. Create Farmer entity
4. Set up proper relationships

### Phase 2: Service Layer

1. Update UsersService with type-specific logic
2. Create ExpertService
3. Create FarmerService
4. Implement unified registration logic

### Phase 3: Controller Layer

1. Update registration endpoint
2. Add type-specific endpoints
3. Implement proper validation

### Phase 4: Admin Setup

1. Create admin seeder
2. Implement admin-only endpoints
3. Add role-based middleware

## API Endpoints

### Authentication

- `POST /auth/register` - Unified registration
- `POST /auth/login` - Login for all user types
- `POST /auth/verify-email` - Email verification

### User Management

- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile
- `GET /admin/users` - Admin: List all users
- `GET /admin/users/:id` - Admin: Get specific user
- `PUT /admin/users/:id` - Admin: Update user
- `DELETE /admin/users/:id` - Admin: Delete user

### Expert-Specific

- `GET /experts` - List all experts
- `GET /experts/:id` - Get expert details
- `PUT /experts/profile` - Update expert profile
- `GET /experts/cases` - Get assigned cases

### Farmer-Specific

- `GET /farmers/profile` - Get farmer profile
- `PUT /farmers/profile` - Update farmer profile
- `GET /farmers/queries` - Get query history

## Security Considerations

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **JWT Tokens**: Secure token-based authentication
3. **Role-Based Access**: Middleware to check user permissions
4. **Input Validation**: Comprehensive validation for all inputs
5. **Rate Limiting**: Prevent abuse of registration/login endpoints

## Error Handling

All API responses follow the standardized format:

```json
{
  "success": boolean,
  "message": "string",
  "data": object | null,
  "errors": array | null
}
```

## Testing Strategy

1. **Unit Tests**: Test individual service methods
2. **Integration Tests**: Test API endpoints
3. **E2E Tests**: Test complete user flows
4. **Security Tests**: Test authentication and authorization

## Deployment Considerations

1. **Environment Variables**: Secure configuration management
2. **Database Migrations**: Proper migration scripts
3. **Admin Seeder**: Automated admin user creation
4. **Monitoring**: Log user registration and login attempts
