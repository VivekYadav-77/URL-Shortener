const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error("ERROR:", {
    message: err.message,
    stack: err.stack,
    status: statusCode,
  });

  if (err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};
export default errorHandler;