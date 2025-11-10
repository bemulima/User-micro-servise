import type { Config } from 'jest';
const config: Config = {
  testEnvironment: 'node',
  transform: { '^.+\\.tsx?$': ['ts-jest', {}] },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
};
export default config;
