const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/response');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'RATE_LIMIT_EXCEEDED',
      'Too many requests, please try again later.',
      req.traceId,
      429
    );
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'RATE_LIMIT_EXCEEDED',
      'Too many authentication attempts, please try again later.',
      req.traceId,
      429
    );
  },
});

module.exports = { apiLimiter, authLimiter };