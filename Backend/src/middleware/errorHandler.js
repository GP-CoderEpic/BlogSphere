// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent'),
        ip: req.ip
    });

    // Default error
    let error = {
        message: err.message || 'Internal Server Error',
        status: err.status || err.statusCode || 500
    };

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { message, status: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, status: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { message, status: 400 };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = { message, status: 401 };
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = { message, status: 401 };
    }

    // Appwrite errors
    if (err.type) {
        switch (err.type) {
            case 'user_not_found':
            case 'document_not_found':
            case 'storage_file_not_found':
                error = { message: 'Resource not found', status: 404 };
                break;
            case 'user_unauthorized':
            case 'general_unauthorized_scope':
                error = { message: 'Unauthorized access', status: 401 };
                break;
            case 'user_invalid_credentials':
                error = { message: 'Invalid credentials', status: 401 };
                break;
            case 'user_email_already_exists':
                error = { message: 'Email already exists', status: 409 };
                break;
            case 'storage_invalid_file_size':
                error = { message: 'File size too large', status: 413 };
                break;
            case 'storage_invalid_file':
                error = { message: 'Invalid file format', status: 400 };
                break;
            case 'general_rate_limit_exceeded':
                error = { message: 'Rate limit exceeded. Please try again later.', status: 429 };
                break;
            default:
                error = { message: err.message || 'Server error', status: err.code || 500 };
        }
    }

    // Express validation errors
    if (err.array && typeof err.array === 'function') {
        const messages = err.array().map(error => error.msg).join(', ');
        error = { message: messages, status: 400 };
    }

    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        error = { message: 'File too large', status: 413 };
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
        error = { message: 'Too many files', status: 400 };
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        error = { message: 'Unexpected file field', status: 400 };
    }

    res.status(error.status).json({
        success: false,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && {
            error: {
                stack: err.stack,
                details: err
            }
        }),
        timestamp: new Date().toISOString(),
        path: req.originalUrl
    });
};

// 404 handler for undefined routes
const notFound = (req, res, next) => {
    const error = new Error(`Route not found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export { errorHandler, notFound, asyncHandler };
