module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>', '<rootDir>/../../tests/frontend'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'utils/**/*.{ts,tsx}',
    '!**/__tests__/**',
    '!**/node_modules/**'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  }
};
