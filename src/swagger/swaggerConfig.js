const swaggerJsdoc = require('swagger-jsdoc');

const serverUrl =
  process.env.RENDER_EXTERNAL_URL ||
  process.env.DEPLOYED_URL ||
  `http://localhost:${process.env.PORT || 3000}`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hintro Meeting Intelligence API',
      version: '1.0.0',
      description:
        'AI-powered meeting intelligence service that captures insights, action items, decisions, and follow-ups from meeting transcripts.',
    },
    servers: [
      {
        url: serverUrl,
        description: process.env.NODE_ENV === 'production' ? 'Production' : 'Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;