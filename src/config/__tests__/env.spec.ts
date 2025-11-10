import { jest } from '@jest/globals';

describe('env config', () => {
  const ORIGINAL_ENV = process.env;

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    jest.resetModules();
  });

  it('exposes defaults and parses numeric values', async () => {
    process.env = {
      ...ORIGINAL_ENV,
      DATABASE_URL: 'postgres://user:pass@localhost:5432/app',
      RABBITMQ_URL: 'amqp://guest:guest@localhost:5672',
      PORT: '3100',
      JWT_ACCESS_TTL: '120',
      JWT_REFRESH_TTL: '600',
      RABBITMQ_PREFETCH: '7',
      RPC_TIMEOUT_MS: '9000',
      RATE_LIMIT_PER_MINUTE: '250',
      CORS_ORIGINS: 'https://alpha.test,https://beta.test',
    } as NodeJS.ProcessEnv;

    const { env } = await import('../env.js');

    expect(env.PORT).toBe(3100);
    expect(env.JWT_ALG).toBe('HS256');
    expect(env.JWT_ACCESS_TTL).toBe(120);
    expect(env.JWT_REFRESH_TTL).toBe(600);
    expect(env.RABBITMQ_PREFETCH).toBe(7);
    expect(env.RPC_TIMEOUT_MS).toBe(9000);
    expect(env.RATE_LIMIT_PER_MINUTE).toBe(250);
    expect(env.CORS_ORIGINS).toEqual(['https://alpha.test', 'https://beta.test']);
    expect(env.REFRESH_TOKEN_ROTATION).toBe(true);
  });

  it('respects boolean feature flags', async () => {
    process.env = {
      ...ORIGINAL_ENV,
      DATABASE_URL: 'postgres://user:pass@localhost:5432/app',
      RABBITMQ_URL: 'amqp://guest:guest@localhost:5672',
      REFRESH_TOKEN_ROTATION: 'false',
      OAUTH_REQUIRE_LOCAL_VERIFICATION: 'true',
    } as NodeJS.ProcessEnv;

    const { env } = await import('../env.js');

    expect(env.REFRESH_TOKEN_ROTATION).toBe(false);
    expect(env.OAUTH_REQUIRE_LOCAL_VERIFICATION).toBe(true);
  });

  it('throws when required variables are missing', async () => {
    process.env = {
      ...ORIGINAL_ENV,
    } as NodeJS.ProcessEnv;
    delete process.env.DATABASE_URL;
    delete process.env.RABBITMQ_URL;

    await expect(import('../env.js')).rejects.toThrow('Missing env: DATABASE_URL');
  });
});
