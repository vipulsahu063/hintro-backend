const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  meeting: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  actionItem: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  reminderHistory: {
    create: jest.fn(),
  },
};

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

module.exports = mockPrisma;