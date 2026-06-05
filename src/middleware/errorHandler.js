const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    traceId: req.traceId,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  }));

  res.locals.errorDetails = err.message;

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return sendError(res, 'UNAUTHORIZED', 'Invalid or expired token', req.traceId, 401);
  }

  if (err.code === 'P2025') {
    return sendError(res, 'NOT_FOUND', 'Resource not found', req.traceId, 404);
  }

  return sendError(
    res,
    err.code || 'INTERNAL_ERROR',
    err.message || 'An unexpected error occurred',
    req.traceId,
    err.statusCode || 500
  );
};

module.exports = errorHandler;