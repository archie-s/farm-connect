module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000,
  moduleNameMapper: {
    '^../../src/app$': '<rootDir>/app',
    '^../../src/utils/jwt$': '<rootDir>/utils/jwt',
    '^../../src/utils/asyncHandler$': '<rootDir>/utils/asyncHandler',
    '^../setup$': '<rootDir>/tests/setup',
  },
};
