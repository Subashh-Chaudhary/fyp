# Crop Disease Detection Backend

A NestJS-based backend API for crop disease detection system with user management, authentication, and expert consultation features.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run start:dev

# Run tests
npm run test

# Build for production
npm run build
```

## 📚 Documentation

All documentation is organized by module for easy navigation:

- **[📋 Documentation Index](./DOCUMENTATION_INDEX.md)** - Complete documentation navigation
- **[🔐 Authentication](./src/modules/auth/docs/)** - Login, registration, and auth features
- **[👥 User Management](./src/modules/users/docs/)** - User CRUD and profile management
- **[🧠 Expert Module](./src/modules/expert/)** - Expert consultation features
- **[🔧 Common Utilities](./src/common/docs/)** - Shared interfaces and standards

## 🏗️ Project Structure

```
src/
├── modules/
│   ├── auth/          # Authentication & authorization
│   ├── users/         # User management (admin users)
│   └── expert/        # Expert consultation features
├── common/            # Shared utilities and interfaces
├── config/            # Configuration management
└── database/          # Database setup and seeds
```

## 🔧 API Standards

This project follows standardized API response formats:

### Success Response

```json
{
  "status": "success",
  "statusCode": 201,
  "message": "User created successfully",
  "data": { ... },
  "meta": { ... }
}
```

### Error Response

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "code": "invalid_email",
      "message": "Email must be a valid email address"
    }
  ]
}
```

## 🛠️ Technologies

- **Framework**: NestJS
- **Database**: TypeORM with MySQL
- **Authentication**: JWT + Google OAuth
- **Validation**: Joi
- **Testing**: Jest

## 📖 Getting Started

1. **Setup**: Follow the [Implementation Guide](./src/common/docs/IMPLEMENTATION_GUIDE.md)
2. **API Standards**: Review [Standardized API Documentation](./src/common/docs/STANDARDIZED_API_DOCUMENTATION.md)
3. **Authentication**: Check [Auth Module Documentation](./src/modules/auth/docs/)
4. **User Management**: See [Users Module Documentation](./src/modules/users/docs/)

## 🤝 Contributing

Please read the documentation in the respective module directories before contributing to specific features.
