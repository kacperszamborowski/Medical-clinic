/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',      // backend environment
  setupFiles: ['dotenv/config'], // loads your .env for Prisma
};
