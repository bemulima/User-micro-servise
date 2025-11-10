import 'dotenv/config';

function requireEnv(name: string, fallback?: string) {
  const v = process.env[name] ?? fallback;
  if (v === undefined) throw new Error(`Missing env: ${name}`);
  return v;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseInt(process.env.PORT ?? '8080', 10),

  DATABASE_URL: requireEnv('DATABASE_URL'),
  TYPEORM_SYNCHRONIZE: process.env.TYPEORM_SYNCHRONIZE === 'true',

  JWT_ALG: process.env.JWT_ALG ?? 'HS256',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY,
  JWT_ACCESS_TTL: parseInt(process.env.JWT_ACCESS_TTL ?? '900', 10),
  JWT_REFRESH_TTL: parseInt(process.env.JWT_REFRESH_TTL ?? '2592000', 10),
  REFRESH_TOKEN_ROTATION: process.env.REFRESH_TOKEN_ROTATION !== 'false',

  OAUTH_GOOGLE_CLIENT_ID: process.env.OAUTH_GOOGLE_CLIENT_ID,
  OAUTH_GOOGLE_CLIENT_SECRET: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
  OAUTH_GITHUB_CLIENT_ID: process.env.OAUTH_GITHUB_CLIENT_ID,
  OAUTH_GITHUB_CLIENT_SECRET: process.env.OAUTH_GITHUB_CLIENT_SECRET,
  OAUTH_REQUIRE_LOCAL_VERIFICATION: process.env.OAUTH_REQUIRE_LOCAL_VERIFICATION === 'true',

  RABBITMQ_URL: requireEnv('RABBITMQ_URL'),
  RABBITMQ_PREFETCH: parseInt(process.env.RABBITMQ_PREFETCH ?? '20', 10),
  RPC_REPLY_QUEUE: process.env.RPC_REPLY_QUEUE ?? 'amq.rabbitmq.reply-to',
  RPC_TIMEOUT_MS: parseInt(process.env.RPC_TIMEOUT_MS ?? '5000', 10),

  VERIFICATION_TOKEN_TTL_SEC: parseInt(process.env.VERIFICATION_TOKEN_TTL_SEC ?? '1800', 10),

  RATE_LIMIT_PER_MINUTE: parseInt(process.env.RATE_LIMIT_PER_MINUTE ?? '60', 10),
  CORS_ORIGINS: (process.env.CORS_ORIGINS ?? '*').split(','),
};
