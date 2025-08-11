# NestJS JWT Authentication System - Login Implementation

## Overview

This implementation provides a complete JWT authentication system with a `/login` endpoint that accepts email and password credentials. The system now supports login across both `users` and `experts` tables with unified authentication.

## Features Implemented

### ✅ Enhanced Login Endpoint

- **Route**: `POST /auth/login`
- **Validation**: Uses class-validator with comprehensive validation rules
- **Security**: Secure password comparison using bcrypt
- **Response**: Returns JWT token and user data on successful authentication
- **Cross-Table Support**: Searches both users and experts tables for authentication

### ✅ Validation Rules

- **Email**: Must be a valid email format and required
- **Password**: Must be at least 6 characters long and required

### ✅ Error Handling

- **400 Bad Request**: When validation fails
- **401 Unauthorized**: When credentials are invalid
- **500 Internal Server Error**: For unexpected errors

### ✅ Security Features

- Password hashing with bcrypt (10 salt rounds)
- Secure password comparison
- JWT token generation with configurable secret
- Environment variable for JWT secret
- Cross-table email uniqueness validation

## Current Implementation Details

### 1. **Cross-Table Authentication**

The login system now searches across both tables:

- **Users Table**: Contains farmers and admin users
- **Experts Table**: Contains expert users
- **Unified Response**: Returns user data with type information

### 2. **Enhanced JWT Payload**

```typescript
{
  sub: string,        // User ID
  email: string,      // User email
  name: string,       // User name
  user_type: string,  // "admin" | "farmer" | "expert"
  iat: number,        // Issued at
  exp: number         // Expires at
}
```

### 3. **Automatic Last Login Tracking**

- Updates `last_login_at` timestamp on successful login
- Tracks user activity for security monitoring
- Supports both users and experts tables

## Files Created/Modified

### 1. `src/modules/auth/dtos/login.dto.ts`

```typescript
export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
```

### 2. `src/modules/auth/auth.service.ts`

- Enhanced `login()` method for cross-table authentication
- Added `findUserByEmail()` method to search both tables
- Secure password comparison using bcrypt
- JWT token generation with user type information
- Automatic last login timestamp update

### 3. `src/modules/auth/auth.controller.ts`

- Enhanced `POST /auth/login` endpoint
- Proper error handling and response formatting
- Uses the existing `ResponseHelper` for consistent responses
- Comprehensive error handling for all scenarios

### 4. `src/modules/users/users.service.ts`

- Maintained `findByEmail()` method for user lookup
- Enhanced error handling and validation

### 5. `src/modules/expert/expert.service.ts`

- Enhanced `findByEmail()` method for expert lookup
- Added `updateLastLogin()` method for activity tracking

## API Usage

### Login Request

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Success Response (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "User Name",
      "email": "user@example.com",
      "user_type": "farmer",
      "is_verified": true,
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "path": "/auth/login",
    "method": "POST"
  }
}
```

### Error Responses

#### Validation Error (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": [
    "Please provide a valid email address",
    "Password must be at least 6 characters long"
  ],
  "error": "Bad Request"
}
```

#### Invalid Credentials (401 Unauthorized)

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

## Authentication Flow

### 1. **Email Lookup**

- Searches `users` table first
- If not found, searches `experts` table
- Returns user object with table information

### 2. **Password Verification**

- Compares provided password with hashed password
- Uses bcrypt for secure comparison
- Throws error if password doesn't match

### 3. **JWT Generation**

- Creates payload with user information
- Includes user type for role-based access
- Signs token with configured secret

### 4. **Response Generation**

- Returns user data (excluding password)
- Includes access token for subsequent requests
- Updates last login timestamp

## Environment Variables Required

Create a `.env` file with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=fyp_db

# Environment
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h
```

## Testing

### Manual Testing

1. Start the application: `npm run dev`
2. Use tools like Postman/curl to test the endpoint
3. Test with both user types (farmer and expert)

### Test Cases

1. **Valid credentials (farmer)**: Should return JWT token with farmer user data
2. **Valid credentials (expert)**: Should return JWT token with expert user data
3. **Invalid email**: Should return 400 validation error
4. **Short password**: Should return 400 validation error
5. **Wrong credentials**: Should return 401 unauthorized
6. **Non-existent user**: Should return 401 unauthorized

## Security Considerations

1. **JWT Secret**: Use a strong, unique secret in production
2. **Password Hashing**: Already implemented with bcrypt (10 salt rounds)
3. **Rate Limiting**: Consider adding rate limiting for login attempts
4. **HTTPS**: Always use HTTPS in production
5. **Token Expiration**: JWT tokens expire in 1 hour (configurable)
6. **Cross-Table Security**: Maintains data isolation while enabling unified auth

## Dependencies Used

- `@nestjs/jwt`: JWT token generation and verification
- `bcrypt`: Password hashing and comparison
- `class-validator`: Request validation
- `@nestjs/typeorm`: Database operations
- `typeorm`: ORM for database interactions
- `ResponseHelper`: Standardized API response formatting

## Next Steps

1. ✅ User registration endpoint (already implemented)
2. ✅ Password reset functionality (already implemented)
3. ✅ Refresh token support (already implemented)
4. ✅ JWT strategy for protected routes (ready for implementation)
5. Add rate limiting
6. Add logging and monitoring
7. Implement role-based middleware
8. Add session management
