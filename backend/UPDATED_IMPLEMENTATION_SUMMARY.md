# Updated User Management System - Implementation Summary

## Overview

The user management system has been updated to use a hybrid approach:

- **Farmers**: Stored in the `users` table with farmer-specific fields
- **Experts**: Stored in the `experts` table with expert-specific fields
- **Admins**: Stored in the `users` table with admin-specific fields

## Database Structure

### 1. Users Table (Admin + Farmers)

```typescript
@Entity()
export class Users {
  // Basic user fields
  id, name, email, password, phone, address, profile_image
  user_type: UserRole.ADMIN | UserRole.FARMER
  // Authentication fields
  is_verified, verification_token, password_reset_token, etc.
  // Social login fields
  social_provider, social_id
  // Farmer-specific fields (only used when user_type is FARMER)
  farm_size, farm_type, location_coordinates, preferred_crops
}
```

### 2. Experts Table (Expert Users + Expert Data)

```typescript
@Entity()
export class Expert {
  // Complete user fields
  id, name, email, password, phone, address, profile_image
  user_type: UserRole.EXPERT (default)
  // Authentication fields
  is_verified, verification_token, password_reset_token, etc.
  // Social login fields
  social_provider, social_id
  // Expert-specific fields
  specialization, experience_years, qualifications, license_number
  is_available, rating, total_cases
}
```

## Key Benefits

### 1. **Simplified Architecture**

- Farmers and admins share the same table (users)
- Experts have their own dedicated table
- No complex JOINs for farmer queries

### 2. **Performance**

- Direct queries for farmers (no JOINs)
- Separate table for experts with specialized data
- Efficient filtering by user_type

### 3. **Data Integrity**

- Farmer data is co-located with user data
- Expert data is isolated in its own table
- Clear separation of concerns

## Registration Flow

### Unified Registration Process

```typescript
// Single endpoint: POST /register
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string (optional)",
  "address": "string (optional)",
  "user_type": "farmer" | "expert",
  "expert_profile": {
    "specialization": "string",
    "experience_years": "number",
    "qualifications": "string",
    "license_number": "string"
  },
  "farmer_profile": {
    "farm_size": "number",
    "farm_type": "string",
    "preferred_crops": ["string"]
  }
}
```

### Registration Logic

1. **Validate user type** (farmer or expert only)
2. **Check email uniqueness** across all tables
3. **Create user based on type**:
   - **Farmer**: Store in `users` table with farmer fields
   - **Expert**: Store in `experts` table with expert fields
4. **Return user object** with type information

## Service Layer

### UsersService

- `register()`: Unified registration for farmers and experts
- `createFarmerUser()`: Creates farmer in users table
- `checkEmailExists()`: Check email across all tables
- `findByEmail()`: Find user by email across all tables
- `findByType()`: Get users by type (admin, farmer)
- `updateFarmerProfile()`: Update farmer-specific fields
- `getFarmerStatistics()`: Get farmer statistics
- `getStatistics()`: Get statistics across all tables

### ExpertService

- `createExpert()`: Creates expert in experts table
- `findById()`: Find expert by ID
- `findByEmail()`: Find expert by email
- `updateExpert()`: Update expert profile
- `getAvailableExperts()`: Get available experts

## API Endpoints

### Registration

- `POST /register` - Unified registration for farmers and experts

### User Management

- `GET /users` - List all users (admin + farmers)
- `GET /users/type/:type` - Get users by type (admin, farmer)
- `GET /users/statistics` - Get user statistics
- `GET /user/:id` - Get specific user
- `PATCH /user/:id` - Update user
- `DELETE /user/:id` - Delete user

### Farmer Management

- `GET /farmers/statistics` - Get farmer statistics
- `PATCH /farmers/:id/profile` - Update farmer profile

### Expert Management

- `GET /experts` - List all experts
- `GET /experts/available` - Get available experts
- `GET /experts/profile` - Get current expert profile
- `PUT /experts/profile` - Update expert profile
- `PUT /experts/availability` - Update availability
- `GET /experts/:id` - Get expert by ID

## Data Storage Strategy

### Farmers

- **Table**: `users`
- **user_type**: `FARMER`
- **Fields**: All basic user fields + farmer-specific fields
- **Benefits**: Simple queries, no JOINs needed

### Experts

- **Table**: `experts`
- **user_type**: `EXPERT`
- **Fields**: All user fields + expert-specific fields
- **Benefits**: Isolated data, specialized queries

### Admins

- **Table**: `users`
- **user_type**: `ADMIN`
- **Fields**: Basic user fields only
- **Benefits**: Simple admin management

## Authentication Considerations

### Login Process

The authentication system needs to:

1. Check email across all tables (users, experts)
2. Return appropriate user object with type information
3. Generate JWT with user type and table information

### JWT Payload

```typescript
{
  email: string,
  sub: string, // user ID
  user_type: "admin" | "farmer" | "expert",
  table: "users" | "experts" // for routing
}
```

## Query Examples

### Get All Farmers

```sql
SELECT * FROM users WHERE user_type = 'farmer';
```

### Get Farmer Statistics

```sql
SELECT
  COUNT(*) as total_farmers,
  AVG(farm_size) as average_farm_size,
  farm_type,
  COUNT(*) as count
FROM users
WHERE user_type = 'farmer'
GROUP BY farm_type;
```

### Get All Experts

```sql
SELECT * FROM experts;
```

## Migration Strategy

### Database Migration

1. Add farmer-specific fields to users table
2. Update existing users to have proper user_type
3. Ensure data integrity

### Code Migration

1. Update entity relationships
2. Modify service methods
3. Update controllers
4. Test all endpoints

## Testing

### Unit Tests

- Test each service method
- Verify email uniqueness across tables
- Test registration flow for each user type

### Integration Tests

- Test complete registration flow
- Verify data storage in correct tables
- Test authentication across tables

### E2E Tests

- Test user journey for each type
- Verify API responses
- Test error scenarios

## Future Enhancements

### 1. Authentication Service Updates

- Implement cross-table user lookup
- Update JWT generation
- Add role-based middleware

### 2. Admin Dashboard

- Unified user management interface
- Statistics across all tables
- Bulk operations

### 3. Performance Optimizations

- Add database indexes on user_type
- Implement caching
- Query optimization

## Conclusion

The updated system provides:

- **Simplified Architecture**: Farmers and admins share the same table
- **Better Performance**: No JOINs for farmer queries
- **Cleaner Code**: Direct CRUD operations for farmers
- **Flexibility**: Separate table for experts with specialized data

This approach is optimal for the crop disease detection system where:

- Farmers are the primary users and need simple, fast queries
- Experts have specialized data requirements
- Admins need basic user management capabilities
