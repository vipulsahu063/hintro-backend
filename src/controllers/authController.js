const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { sendSuccess, sendError } = require('../utils/response');
const { z } = require('zod');

const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
});

exports.register = async (req, res, next) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return sendError(res, 'VALIDATION_ERROR', result.error.issues[0].message, req.traceId, 400);
    }

    const { email, password, name } = result.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return sendError(res, 'CONFLICT', 'User with this email already exists', req.traceId, 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return sendSuccess(res, { user, token }, req.traceId, 201);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return sendError(res, 'VALIDATION_ERROR', result.error.issues[0].message, req.traceId, 400);
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendError(res, 'AUTH_ERROR', 'Invalid email or password', req.traceId, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, 'AUTH_ERROR', 'Invalid email or password', req.traceId, 401);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return sendSuccess(res, {
      user: { id: user.id, email: user.email, name: user.name },
      token,
    }, req.traceId);
  } catch (err) {
    next(err);
  }
};