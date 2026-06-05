const request = require('supertest');
const app = require('../src/app');
const mockPrisma = require('./setupPrismaMock');
const bcrypt = require('bcryptjs');

describe('Auth Endpoints', () => {
  const testEmail = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/auth/register — should register a new user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: 'user-1',
      email: testEmail,
      name: 'Test User',
      createdAt: new Date(),
    });

    const res = await request(app).post('/api/auth/register').send({
      email: testEmail,
      password: 'password123',
      name: 'Test User',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.traceId).toBeDefined();
  });

  test('POST /api/auth/register — should fail with invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'not-an-email',
      password: 'password123',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('POST /api/auth/register — should fail with duplicate email', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: testEmail,
    });

    const res = await request(app).post('/api/auth/register').send({
      email: testEmail,
      password: 'password123',
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  test('POST /api/auth/login — should login with correct credentials', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: testEmail,
      password: hashedPassword,
      name: 'Test User',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  test('POST /api/auth/login — should fail with wrong password', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: testEmail,
      password: hashedPassword,
      name: 'Test User',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error.code).toBe('AUTH_ERROR');
  });
});