// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  // Log error details for debugging
  console.error("❌ [Error Handler] Error caught:", err);
  console.error("❌ [Error Handler] Stack:", err.stack);

  // Multer file upload errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      error: "File too large",
      message: "File size cannot exceed 10MB",
    });
  }

  if (err.message === "Only image files are allowed") {
    return res.status(400).json({
      error: "Invalid file type",
      message: "Only image files are allowed",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Invalid token",
      message: "The provided token is invalid",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token expired",
      message: "Your session has expired. Please log in again",
    });
  }

  // DynamoDB errors
  if (err.name === "ConditionalCheckFailedException") {
    return res.status(409).json({
      error: "Resource already exists",
      message: "The resource you're trying to create already exists",
    });
  }

  // AWS S3 errors
  if (err.name === "NoSuchBucket") {
    return res.status(500).json({
      error: "Storage configuration error",
      message: "Server storage is not properly configured",
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    error: "Server error",
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
