import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Limpar o banco de dados antes de todos os testes
  await prisma.$connect();
  await prisma.order.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.auth.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.address.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Aumentar o timeout para testes E2E
jest.setTimeout(30000); 