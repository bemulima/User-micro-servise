import type { FastifyRequest, FastifyReply } from 'fastify';

export async function jwtGuard(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch {
    return reply.status(401).send({ code: 'UNAUTHORIZED', message: 'Invalid or missing token' });
  }
}
