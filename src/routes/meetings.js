const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const authMiddleware = require('../middleware/auth');
const { createMeetingSchema, validate } = require('../validators/meetingValidator');

/**
 * @swagger
 * /api/meetings:
 *   post:
 *     summary: Create a new meeting with transcript
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, participants, meetingDate, transcript]
 *             properties:
 *               title:
 *                 type: string
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: email
 *               meetingDate:
 *                 type: string
 *                 format: date-time
 *               transcript:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: string
 *                     speaker:
 *                       type: string
 *                     text:
 *                       type: string
 *     responses:
 *       201:
 *         description: Meeting created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, validate(createMeetingSchema), meetingController.createMeeting);

/**
 * @swagger
 * /api/meetings:
 *   get:
 *     summary: List all meetings with pagination
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by title (optional)
 *     responses:
 *       200:
 *         description: List of meetings
 */
router.get('/', authMiddleware, meetingController.listMeetings);

/**
 * @swagger
 * /api/meetings/{id}:
 *   get:
 *     summary: Get a single meeting by ID
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meeting details
 *       404:
 *         description: Meeting not found
 */
router.get('/:id', authMiddleware, meetingController.getMeeting);

/**
 * @swagger
 * /api/meetings/{id}/analyze:
 *   post:
 *     summary: Analyze meeting transcript using AI
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: AI analysis with summary, action items, decisions, follow-up suggestions
 *       404:
 *         description: Meeting not found
 */
router.post('/:id/analyze', authMiddleware, meetingController.analyzeMeetingById);

module.exports = router;