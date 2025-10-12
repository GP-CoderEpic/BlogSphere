// Request logging middleware for better debugging and monitoring

const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Store original res.json to capture response data
    const originalJson = res.json;
    let responseBody;
    
    res.json = function(data) {
        responseBody = data;
        return originalJson.call(this, data);
    };

    // Log request
    console.log(`🔵 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        contentType: req.get('Content-Type'),
        ...(req.body && Object.keys(req.body).length > 0 && {
            body: hidesSensitiveData(req.body)
        })
    });

    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusColor = res.statusCode >= 400 ? '🔴' : res.statusCode >= 300 ? '🟡' : '🟢';
        
        console.log(`${statusColor} ${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`, {
            status: res.statusCode,
            duration: `${duration}ms`,
            contentLength: res.get('Content-Length'),
            ...(responseBody && res.statusCode >= 400 && {
                error: responseBody.message
            })
        });
    });

    next();
};

// Helper function to hide sensitive data in logs
const hidesSensitiveData = (obj) => {
    const sensitiveFields = ['password', 'token', 'apiKey', 'secret'];
    const cleaned = { ...obj };
    
    for (const field of sensitiveFields) {
        if (cleaned[field]) {
            cleaned[field] = '***HIDDEN***';
        }
    }
    
    return cleaned;
};

export { requestLogger };
