const { z } = require('zod');

const transcriptEntrySchema = z.object({
  timestamp: z.string().min(1, 'Timestamp is required'),
  speaker: z.string().min(1, 'Speaker is required'),
  text: z.string().min(1, 'Text is required'),
});

const createMeetingSchema = z.object({
  title: z.string().min(1, 'Meeting title is required'),
  participants: z
    .array(z.string().email('Invalid email address in participants'))
    .min(1, 'At least one participant is required'),
  meetingDate: z.string().datetime('Invalid date format. Use ISO 8601 format'),
  transcript: z
    .array(transcriptEntrySchema)
    .min(1, 'Transcript must have at least one entry'),
});

const validate = (schema) => (req, res, next) => {
  const { sendError } = require('../utils/response');
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const firstError = result.error.issues[0];
    return sendError(
      res,
      'VALIDATION_ERROR',
      firstError?.message || 'Invalid request body',
      req.traceId,
      400
    );
  }

  req.validatedBody = result.data;
  next();
};

module.exports = { createMeetingSchema, validate };