# Expert Module Documentation

This document outlines the complete CRUD (Create, Read, Update, Delete) operations for the Expert module in the backend API.

## Overview

The Expert module provides comprehensive management of expert users, including profile management, availability tracking, rating system, and specialized search capabilities.

**Note**: Expert creation is handled in the Auth module during registration, not in this module.

## API Endpoints

### 1. Get All Experts (Paginated)

- **Endpoint**: `GET /experts`
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response**: Paginated list of experts with metadata
- **Example**: `GET /experts?page=1&limit=10`

### 2. Get Expert by ID

- **Endpoint**: `GET /experts/:id`
- **Parameters**: `id` (UUID)
- **Response**: Expert details
- **Error**: 404 if expert not found

### 3. Update Expert

- **Endpoint**: `PUT /experts/:id`
- **Parameters**: `id` (UUID)
- **Body**: `UpdateExpertDto`
- **Response**: Updated expert object
- **Validation**: Email uniqueness check if email is being updated

### 4. Delete Expert

- **Endpoint**: `DELETE /experts/:id`
- **Parameters**: `id` (UUID)
- **Response**: Success message
- **Error**: 404 if expert not found

### 5. Get Current Expert Profile (Authenticated)

- **Endpoint**: `GET /experts/profile/me`
- **Authentication**: Required
- **Response**: Current expert's profile

### 6. Update Current Expert Profile (Authenticated)

- **Endpoint**: `PUT /experts/profile/me`
- **Authentication**: Required
- **Body**: `UpdateExpertDto`
- **Response**: Updated expert profile

## Specialized Endpoints

### 7. Get Available Experts

- **Endpoint**: `GET /experts/available/list`
- **Response**: List of available experts sorted by rating

### 8. Search by Specialization

- **Endpoint**: `GET /experts/search/specialization/:specialization`
- **Parameters**: `specialization` (string)
- **Response**: Experts with matching specialization

### 9. Search by Experience Range

- **Endpoint**: `GET /experts/search/experience`
- **Query Parameters**:
  - `minYears` (required): Minimum years of experience
  - `maxYears` (required): Maximum years of experience
- **Response**: Experts within experience range

### 10. Get Top Rated Experts

- **Endpoint**: `GET /experts/top-rated/list`
- **Query Parameters**:
  - `limit` (optional): Number of experts to return (default: 10)
- **Response**: Top rated experts

### 11. Update Expert Availability

- **Endpoint**: `PUT /experts/:id/availability`
- **Parameters**: `id` (UUID)
- **Body**: `{ isAvailable: boolean }`
- **Response**: Updated expert

### 12. Update Expert Rating

- **Endpoint**: `PUT /experts/:id/rating`
- **Parameters**: `id` (UUID)
- **Body**: `{ rating: number }`
- **Response**: Updated expert

## Data Transfer Objects (DTOs)

### UpdateExpertDto

```typescript
{
  email?: string;          // Optional, unique if provided
  name?: string;           // Optional, 3-100 characters
  phone?: string;          // Optional, numbers only
  address?: string;        // Optional
  profile_image?: string;  // Optional, valid URL
  specialization?: string; // Optional, max 255 characters
  experience_years?: number; // Optional, 0-50 years
  qualifications?: string; // Optional
  license_number?: string; // Optional, max 100 characters
  is_available?: boolean;  // Optional
  is_verified?: boolean;   // Optional
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
  profile_image?: string;        // Profile image URL
  user_type: UserRole.EXPERT;    // User role
  social_provider?: string;      // Social login provider
  social_id?: string;            // Social login ID
  is_verified: boolean;          // Verification status
  verification_token?: string;   // Email verification token
  password_reset_token?: string; // Password reset token
  reset_token_expires?: Date;    // Reset token expiry
  specialization?: string;       // Expert specialization
  experience_years?: number;     // Years of experience
  qualifications?: string;       // Professional qualifications
  license_number?: string;       // Professional license
  is_available: boolean;         // Availability status
  rating: number;                // Average rating (0.00-5.00)
  total_cases: number;           // Total cases handled
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

- `getAvailableExperts()`: Get available experts
- `updateAvailability(id: string, isAvailable: boolean)`: Update availability
- `updateRating(id: string, rating: number)`: Update rating
- `incrementCases(id: string)`: Increment total cases
- `findBySpecialization(specialization: string)`: Search by specialization
- `findByExperienceRange(minYears: number, maxYears: number)`: Search by experience
- `getTopRatedExperts(limit: number)`: Get top rated experts

## Error Handling

The service includes comprehensive error handling:

- **ConflictException**: Email already exists
- **NotFoundException**: Expert not found
- **BadRequestException**: Invalid data or operation failure

## Validation

All endpoints include proper validation:

- Email format validation
- Phone number format validation
- URL validation for profile images
- Experience years range validation (0-50)
- String length limits

## Security Considerations

- Email uniqueness is enforced
- Authentication required for profile operations
- Input validation prevents injection attacks
- Proper error messages without sensitive data exposure
