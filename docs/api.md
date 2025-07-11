# API Documentation

## Overview

The Crop Disease Detection API is built with NestJS and provides endpoints for user authentication, disease detection, expert consultation, and report generation.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/login

Login with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "jwt-token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /auth/register

Register a new user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### Disease Detection

#### POST /disease/detect

Upload an image for disease detection.

**Request:**

- Content-Type: multipart/form-data
- Body: image file

**Response:**

```json
{
  "disease": "Tomato___Early_blight",
  "confidence": 0.95,
  "recommendations": [
    "Remove infected leaves",
    "Apply fungicide",
    "Improve air circulation"
  ]
}
```

### Expert Consultation

#### GET /expert/consultations

Get user's consultation history.

**Response:**

```json
{
  "consultations": [
    {
      "id": 1,
      "disease": "Tomato___Early_blight",
      "expert_advice": "Apply copper-based fungicide",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Reports

#### GET /reports/generate/:detectionId

Generate PDF report for a detection.

**Response:**

- Content-Type: application/pdf
- Body: PDF file

### Users

#### GET /users/profile

Get current user profile.

**Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": ["email must be an email"]
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```
