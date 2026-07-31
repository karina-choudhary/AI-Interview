const errorMiddleware = (err, req, res, next) => {
    // 1. Extract status code and message with fallbacks
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // 2. Send the structured JSON response
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
        // Include stack trace only during local development
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorMiddleware;
