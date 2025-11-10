import type { FastifyRequest, FastifyReply } from 'fastify';

export function rbacGuard(roles: string[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req.user ?? {}) as any;
    if (!user?.role || !roles.includes(user.role)) {
      return reply.status(403).send({ code: 'FORBIDDEN', message: 'Insufficient role' });
    }
  };
}
