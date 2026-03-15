const { PrismaClient } = require('@prisma/client');

// Use the main database for testing since we have seed data
const prisma = new PrismaClient();

// Global test setup
beforeAll(async () => {
  // Connect to database
  await prisma.$connect();
});

// Clean up after all tests
afterAll(async () => {
  // Disconnect from database
  await prisma.$disconnect();
});

module.exports = { prisma };
