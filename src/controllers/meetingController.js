const { PrismaClient } = require('@prisma/client');
const { sendSuccess, sendError } = require('../utils/response');
const { analyzeMeeting } = require('../services/aiService');

const prisma = new PrismaClient();

exports.createMeeting = async (req, res, next) => {
  try {
    const { title, participants, meetingDate, transcript } = req.validatedBody;

    const meeting = await prisma.meeting.create({
      data: {
        title,
        participants,
        meetingDate: new Date(meetingDate),
        transcript,
        userId: req.user.userId,
      },
    });

    return sendSuccess(res, meeting, req.traceId, 201);
  } catch (err) {
    next(err);
  }
};

exports.getMeeting = async (req, res, next) => {
  try {
    const meeting = await prisma.meeting.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
      include: { actionItems: true },
    });

    if (!meeting) {
      return sendError(res, 'NOT_FOUND', 'Meeting not found', req.traceId, 404);
    }

    return sendSuccess(res, meeting, req.traceId);
  } catch (err) {
    next(err);
  }
};

exports.listMeetings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Optional filtering
    const where = { userId: req.user.userId };
    if (req.query.title) {
      where.title = { contains: req.query.title, mode: 'insensitive' };
    }

    const [meetings, total] = await Promise.all([
      prisma.meeting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { actionItems: true } } },
      }),
      prisma.meeting.count({ where }),
    ]);

    return sendSuccess(res, {
      meetings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }, req.traceId);
  } catch (err) {
    next(err);
  }
};

exports.analyzeMeetingById = async (req, res, next) => {
  try {
    const meeting = await prisma.meeting.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
    });

    if (!meeting) {
      return sendError(res, 'NOT_FOUND', 'Meeting not found', req.traceId, 404);
    }

    const analysis = await analyzeMeeting(meeting.transcript);

    // Save extracted action items to DB automatically
    if (analysis.actionItems && analysis.actionItems.length > 0) {
      for (const item of analysis.actionItems) {
        await prisma.actionItem.create({
          data: {
            task: item.task,
            assignee: item.assignee,
            citations: item.citations,
            meetingId: meeting.id,
            status: 'PENDING',
          },
        });
      }
    }

    // Save analysis to meeting
    const updatedMeeting = await prisma.meeting.update({
      where: { id: meeting.id },
      data: { analysis },
    });

    return sendSuccess(res, { analysis, meeting: updatedMeeting }, req.traceId);
  } catch (err) {
    next(err);
  }
};