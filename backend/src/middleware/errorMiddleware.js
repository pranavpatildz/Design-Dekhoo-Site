// Centralized Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // If status code is 200, it's a server error

  res.status(statusCode).json({
    message: err.message,
    // In production, you might not want to send the stack trace
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// 404 Not Found Middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the errorHandler
};

module.exports = { errorHandler, notFound };
