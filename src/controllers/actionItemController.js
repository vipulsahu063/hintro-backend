const { PrismaClient } = require('@prisma/client');
const { sendSuccess, sendError } = require('../utils/response');

const prisma = new PrismaClient();

// POST /api/action-items
exports.createActionItem = async (req, res, next) => {
  try {
    const { task, assignee, meetingId, dueDate, status } = req.validatedBody;

    // Verify meeting exists and belongs to user
    const meeting = await prisma.meeting.findFirst({
      where: { id: meetingId, userId: req.user.userId },
    });

    if (!meeting) {
      return sendError(res, 'NOT_FOUND', 'Meeting not found', req.traceId, 404);
    }

    const actionItem = await prisma.actionItem.create({
      data: {
        task,
        assignee,
        meetingId,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || 'PENDING',
      },
    });

    return sendSuccess(res, actionItem, req.traceId, 201);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/action-items/:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.validatedBody;

    const actionItem = await prisma.actionItem.findFirst({
      where: {
        id: req.params.id,
        meeting: { userId: req.user.userId },
      },
    });

    if (!actionItem) {
      return sendError(res, 'NOT_FOUND', 'Action item not found', req.traceId, 404);
    }

    const updated = await prisma.actionItem.update({
      where: { id: req.params.id },
      data: { status },
    });

    return sendSuccess(res, updated, req.traceId);
  } catch (err) {
    next(err);
  }
};

// GET /api/action-items — filter by status, assignee, meetingId
exports.getActionItems = async (req, res, next) => {
  try {
    const { status, assignee, meetingId, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      meeting: { userId: req.user.userId },
    };

    if (status) where.status = status;
    if (assignee) where.assignee = { contains: assignee, mode: 'insensitive' };
    if (meetingId) where.meetingId = meetingId;

    const [actionItems, total] = await Promise.all([
      prisma.actionItem.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: { meeting: { select: { id: true, title: true } } },
      }),
      prisma.actionItem.count({ where }),
    ]);

    return sendSuccess(res, {
      actionItems,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    }, req.traceId);
  } catch (err) {
    next(err);
  }
};

// GET /api/action-items/overdue
// Overdue = status != COMPLETED AND dueDate < current time
exports.getOverdueActionItems = async (req, res, next) => {
  try {
    const overdueItems = await prisma.actionItem.findMany({
      where: {
        meeting: { userId: req.user.userId },
        status: { not: 'COMPLETED' },
        dueDate: { lt: new Date() },
      },
      include: {
        meeting: { select: { id: true, title: true } },
        reminders: { orderBy: { sentAt: 'desc' }, take: 1 },
      },
      orderBy: { dueDate: 'asc' },
    });

    return sendSuccess(res, { overdueItems, total: overdueItems.length }, req.traceId);
  } catch (err) {
    next(err);
  }
};