import type { FastifyInstance } from 'fastify';
import { jwtGuard } from '../../auth/jwt.guard.js';
import { rbacGuard } from '../../auth/rbac.guard.js';
import type { UserRepoPort } from '../../../domain/ports/user-repo.port.js';
import { container } from '../../../di/container.js';
import { UpdateProfileDto } from '../dto/user.dto.js';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function usersController(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>();

  router.get('/users/me', { preHandler: [jwtGuard] }, async (req, reply) => {
    const user = req.user as any;
    const repo = container.resolve<UserRepoPort>('UserRepo');
    const profile = await repo.getProfile(user.sub);
    return reply.send({ id: user.sub, role: user.role, profile });
  });

  router.patch('/users/me', { preHandler: [jwtGuard] }, async (req, reply) => {
    const body = UpdateProfileDto.parse(req.body);
    const user = req.user as any;
    const repo = container.resolve<UserRepoPort>('UserRepo');
    const updated = await repo.upsertProfile({
      userId: user.sub,
      displayName: body.display_name ?? null,
      avatarUrl: body.avatar_url ?? null,
      locale: body.locale ?? null,
      timezone: body.timezone ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return reply.send(updated);
  });

  router.get('/users', { preHandler: [jwtGuard, rbacGuard(['moderator', 'admin'])] }, async (req, reply) => {
    const page = parseInt((req.query as any).page ?? '1', 10);
    const limit = parseInt((req.query as any).limit ?? '20', 10);
    const role = (req.query as any).role;
    const repo = container.resolve<UserRepoPort>('UserRepo');
    return reply.send(await repo.list(page, limit, role));
  });

  router.get('/users/:id', { preHandler: [jwtGuard, rbacGuard(['moderator', 'admin'])] }, async (req, reply) => {
    const { id } = req.params as any;
    const repo = container.resolve<UserRepoPort>('UserRepo');
    const user = await repo.findById(id);
    if (!user) return reply.status(404).send({ code: 'NOT_FOUND', message: 'User not found' });
    return reply.send(user);
  });

  router.delete('/users/:id', { preHandler: [jwtGuard, rbacGuard(['moderator', 'admin'])] }, async (req, reply) => {
    const { id } = req.params as any;
    const repo = container.resolve<UserRepoPort>('UserRepo');
    await repo.deleteById(id);
    return reply.send({ ok: true });
  });
}
