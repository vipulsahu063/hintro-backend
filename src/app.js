const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig');
const traceIdMiddleware = require('./middleware/traceId');
const loggerMiddleware = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');

const app = express();

// Ratelimiter
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);


// CORS — must be enabled (*)
app.use(cors());
app.use(express.json());

// Middleware
app.use(traceIdMiddleware);
app.use(loggerMiddleware);

// Swagger — publicly accessible, no auth
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

// Evaluation endpoint
app.get('/api/evaluation', (req, res) => {
  res.json({
    candidateName: 'Vipul Sahu',
    email: 'vipulsahu063@gmail.com',
    repositoryUrl: 'https://github.com/vipulsahu063/hintro-backend',
    deployedUrl: process.env.DEPLOYED_URL || 'https://hintro-backend.onrender.com/',
    externalIntegration: 'Discord Webhook',
    features: [
      'JWT Authentication',
      'Meeting Management with Pagination',
      'AI Meeting Analysis with Citation Grounding',
      'Action Item Management',
      'Overdue Detection',
      'Scheduled Reminder Job (node-cron)',
      'Discord Webhook Integration',
      'Swagger/OpenAPI Documentation',
      'Input Validation (Zod)',
      'Structured Logging with Trace IDs',
    ],
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/meetings', require('./routes/meetings'));
app.use('/api/action-items', require('./routes/actionItems'));

// 404 handler
app.use((req, res) => {
  const { sendError } = require('./utils/response');
  sendError(res, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`, req.traceId, 404);
});

// Global error handler — must be last
app.use(errorHandler);

module.exports = app;