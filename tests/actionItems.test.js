const request = require('supertest');
const app = require('../src/app');
const mockPrisma = require('./setupPrismaMock');
const jwt = require('jsonwebtoken');

describe('Action Item Overdue Logic', () => {
  let token;

  beforeAll(() => {
    token = jwt.sign(
      { userId: 'user-1', email: 'test@example.com' },
      process.env.JWT_SECRET
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/action-items/overdue — should require auth', async () => {
    const res = await request(app).get('/api/action-items/overdue');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/action-items/overdue — should return array when authenticated', async () => {
    mockPrisma.actionItem.findMany.mockResolvedValue([
      {
        id: 'item-1',
        task: 'Prepare release notes',
        assignee: 'Alice',
        status: 'PENDING',
        dueDate: new Date('2026-05-01T00:00:00Z'),
        meeting: { id: 'meeting-1', title: 'Sprint Planning' },
        reminders: [],
      },
    ]);

    const res = await request(app)
      .get('/api/action-items/overdue')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.overdueItems)).toBe(true);
  });

  test('PATCH /api/action-items/:id/status — should reject invalid status', async () => {
    const res = await request(app)
      .patch('/api/action-items/fake-id/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'INVALID_STATUS' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});