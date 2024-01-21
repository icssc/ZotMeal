/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

// export default {
//     transform: {
//         '^.+\\.ts?$': 'ts-jest',
//     },
//     clearMocks: true,
//     collectCoverage: true,
//     coverageDirectory: 'coverage',
//     coverageProvider: 'v8',
//     testMatch: ['**/tests/unit/*.test.ts'],
// };

module.exports = {
    testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
};
