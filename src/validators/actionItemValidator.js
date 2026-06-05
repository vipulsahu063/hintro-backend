const { z } = require('zod');
const { validate } = require('./meetingValidator');

const createActionItemSchema = z.object({
  task: z.string().min(1, 'Task description is required'),
  assignee: z.string().min(1, 'Assignee is required'),
  meetingId: z.string().uuid('Invalid meeting ID'),
  dueDate: z.string().datetime('Invalid due date format').optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'], {
    errorMap: () => ({ message: 'Status must be PENDING, IN_PROGRESS, or COMPLETED' }),
  }),
});

module.exports = { createActionItemSchema, updateStatusSchema, validate };