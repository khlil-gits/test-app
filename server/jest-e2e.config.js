module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testEnvironment: 'node',
    testRegex: '.e2e-spec.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverage: true,
    coverageDirectory: './coverage-e2e',
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    // Add more configuration as needed
  };