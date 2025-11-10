import type { FastifyInstance } from 'fastify';
import { authController } from './controllers/auth.controller.js';
import { usersController } from './controllers/users.controller.js';

export async function registerRoutes(app: FastifyInstance) {
  await authController(app);
  await usersController(app);
}
