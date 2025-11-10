import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { env } from './config/env.js';
import { registerJwt } from './infrastructure/auth/jwt.service.js';
import { registerRoutes } from './infrastructure/http/routes.js';
import { healthController } from './infrastructure/observability/health.controller.js';
import { metrics } from './infrastructure/observability/metrics.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(helmet);
  await app.register(cors, { origin: env.CORS_ORIGINS });
  await app.register(rateLimit, { max: env.RATE_LIMIT_PER_MINUTE, timeWindow: '1 minute' });
  await app.register(sensible);

  await registerJwt(app);

  await app.register(swagger, {
    openapi: {
      info: { title: 'user-service', version: '1.0.0' },
      components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer' } } },
      security: [{ bearerAuth: [] }],
    },
  });
  await app.register(swaggerUi, { routePrefix: '/docs' });

  await healthController(app);
  await metrics(app);
  await registerRoutes(app);

  return app;
}
