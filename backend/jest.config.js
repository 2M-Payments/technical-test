/** @type {import('jest').Config} */
module.exports = {
  // Testes apenas transpilam (rápido); a checagem de tipos fica no `npm run typecheck`.
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  setupFiles: ['<rootDir>/src/tests/setup.ts'],
  clearMocks: true,
  collectCoverageFrom: [
    'src/controllers/**/*.ts',
    'src/services/**/*.ts',
    'src/middlewares/**/*.ts',
    'src/dtos/**/*.ts',
    'src/mappers/**/*.ts',
    'src/errors/**/*.ts',
  ],
  coverageDirectory: 'coverage',
};
