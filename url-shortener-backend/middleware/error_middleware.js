const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // LOG FOR DEVELOPER
  console.error(`[ERROR] ${statusCode} - ${message}`);

  // RESPONSE FOR USER
  res.status(statusCode).json({
    success: false,
    message: message,
    // SECURITY: Hide the file paths/logic
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

export default errorHandler;
