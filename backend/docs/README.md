# Backend API Documentation

This directory contains comprehensive documentation for the backend API modules.

## Module Documentation

### [Auth Module](./modules/auth/README.md)

Complete authentication system including:

- User registration (farmers and experts)
- Login with JWT tokens
- Email verification
- Password reset functionality
- Social authentication (Google OAuth)
- Token management and refresh

### [Users Module](./modules/users/README.md)

User management system for farmers and admins:

- CRUD operations for users
- Profile management
- Social authentication support
- **Note**: Registration is handled in the Auth module

### [Expert Module](./modules/expert/README.md)

Complete CRUD operations for expert user management, including:

- Profile management
- Availability tracking
- Rating system
- Specialized search capabilities
- **Note**: Expert creation is handled in the Auth module

## Documentation Structure

```
docs/
├── README.md                    # This file
└── modules/
    ├── auth/
    │   ├── README.md           # Auth module documentation
    │   ├── LOGIN_IMPLEMENTATION.md
    │   ├── REGISTRATION_MIGRATION_SUMMARY.md
    │   └── TOKEN_MANAGEMENT_BEST_PRACTICES.md
    ├── users/
    │   ├── README.md           # Users module documentation
    │   ├── USER_CRUD_IMPLEMENTATION_SUMMARY.md
    │   ├── USER_MANAGEMENT_SUMMARY.md
    │   ├── USER_MANAGEMENT_SYSTEM_DOCUMENTATION.md
    │   └── UPDATED_IMPLEMENTATION_SUMMARY.md
    └── expert/
        └── README.md           # Expert module documentation
```

## System Architecture

The backend implements a hybrid user management approach:

- **Farmers & Admins**: Stored in the `users` table
- **Experts**: Stored in the `experts` table
- **Authentication**: Centralized in the `auth` module
- **User Management**: Separated by module for better organization

## Contributing

When adding new modules or updating existing ones:

1. Create module-specific documentation in `docs/modules/[module-name]/`
2. Update this README.md to include links to new documentation
3. Follow the established documentation format
4. Include API endpoints, DTOs, and usage examples
5. Update related documentation files when making code changes
