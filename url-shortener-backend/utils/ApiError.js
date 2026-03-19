class ApiError extends Error {
  constructor(statusCode, message,errors = []) {
    super(message);
    this.errors = errors;
    this.statusCode = statusCode;
    this.isOperational = true; // 🔥 THIS IS KEY

    Error.captureStackTrace(this, this.constructor);
  }
}
export default ApiError;