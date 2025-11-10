import type { FastifyInstance } from 'fastify';
import { env } from '../../config/env.js';

export function registerJwt(app: FastifyInstance) {
  const jwtOpts: any = {
    sign: {
      algorithm: env.JWT_ALG,
      expiresIn: env.JWT_ACCESS_TTL,
    },
  };

  if (env.JWT_ALG === 'HS256') {
    if (!env.JWT_SECRET) throw new Error('JWT_SECRET required for HS256');
    jwtOpts.secret = env.JWT_SECRET;
  } else {
    if (!env.JWT_PRIVATE_KEY || !env.JWT_PUBLIC_KEY) throw new Error('RSA keys required for RS256');
    jwtOpts.secret = {
      private: env.JWT_PRIVATE_KEY,
      public: env.JWT_PUBLIC_KEY,
      format: 'pem',
      passphrase: '',
    };
  }

  app.register(import('@fastify/jwt'), jwtOpts);
}
