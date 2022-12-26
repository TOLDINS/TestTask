/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
    verbose: true,
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
    roots: ['<rootDir>/src/'],
    moduleNameMapper: {
        '^@app/(.*)': '<rootDir>/src/$1',
        '^@common/(.*)': '<rootDir>/src/common/$1',
        '^@test/(.*)': '<rootDir>/test/$1',
    },
    maxWorkers: '30%',
};

module.exports = async () => config;
