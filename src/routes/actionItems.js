const express = require('express');
const router = express.Router();
const actionItemController = require('../controllers/actionItemController');
const authMiddleware = require('../middleware/auth');
const { createActionItemSchema, updateStatusSchema, validate } = require('../validators/actionItemValidator');

/**
 * @swagger
 * /api/action-items:
 *   post:
 *     summary: Create a new action item manually
 *     tags: [Action Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [task, assignee, meetingId]
 *             properties:
 *               task:
 *                 type: string
 *               assignee:
 *                 type: string
 *               meetingId:
 *                 type: string
 *                 format: uuid
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED]
 *     responses:
 *       201:
 *         description: Action item created
 *       400:
 *         description: Validation error
 *       404:
 *         description: Meeting not found
 */
router.post('/', authMiddleware, validate(createActionItemSchema), actionItemController.createActionItem);

/**
 * @swagger
 * /api/action-items/overdue:
 *   get:
 *     summary: Get all overdue action items (status != COMPLETED and dueDate < now)
 *     tags: [Action Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of overdue action items
 */
// IMPORTANT: /overdue must be defined BEFORE /:id to avoid route conflict
router.get('/overdue', authMiddleware, actionItemController.getOverdueActionItems);

/**
 * @swagger
 * /api/action-items:
 *   get:
 *     summary: Get action items with optional filters
 *     tags: [Action Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED]
 *       - in: query
 *         name: assignee
 *         schema:
 *           type: string
 *       - in: query
 *         name: meetingId
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of action items
 */
router.get('/', authMiddleware, actionItemController.getActionItems);

/**
 * @swagger
 * /api/action-items/{id}/status:
 *   patch:
 *     summary: Update action item status
 *     tags: [Action Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Action item not found
 */
router.patch('/:id/status', authMiddleware, validate(updateStatusSchema), actionItemController.updateStatus);

module.exports = router;