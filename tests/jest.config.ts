/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  modulePaths: [
    "<rootDir>"
  ]
};
export default config;