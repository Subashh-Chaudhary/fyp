API Response: 
Success
{
      status: 'success',
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: {
        user,
      },
      meta: {},
};

Error
{
  "status": "error",
  "statusCode": 400, // HTTP status code
  "message": "Validation failed", // Human-readable error summary
  "errors": [ // Detailed error messages (optional)
    {
      "code": "invalid_email",
      "message": "Email must be a valid email address"
    }
  ],
  "stack": "Error stack trace (DEV only)" // Only in development
}
