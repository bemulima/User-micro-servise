import type { FastifyInstance } from 'fastify';
import { SignupDto, SigninDto, CodeVerificationDto, RestoreDto } from '../dto/auth.dto.js';
import { container } from '../../../di/container.js';
import { SignupUseCase } from '../../../application/use-cases/signup.usecase.js';
import { VerifyCodeUseCase } from '../../../application/use-cases/verify-code.usecase.js';
import { z } from 'zod';
import { verifyPassword } from '../../crypto/argon2.service.js';
import type { UserRepoPort } from '../../../domain/ports/user-repo.port.js';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function authController(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>();

  router.post('/auth/signup', {
    schema: { body: SignupDto },
    handler: async (req, reply) => {
      const body = req.body as z.infer<typeof SignupDto>;
      const uc = container.resolve(SignupUseCase);
      const res = await uc.exec(body.email, body.password, body.provider);
      return reply.status(200).send(res);
    },
  });

  router.post('/auth/signin', {
    schema: { body: SigninDto },
    handler: async (req, reply) => {
      const body = req.body as z.infer<typeof SigninDto>;
      const repo = container.resolve<UserRepoPort>('UserRepo');
      const user = await repo.findByEmail(body.email.toLowerCase());
      if (!user || !user.passwordHash) return reply.status(401).send({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });
      const ok = await verifyPassword(user.passwordHash, body.password);
      if (!ok) return reply.status(401).send({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });
      const access_token = await req.jwt.sign({ sub: user.id, role: user.role }, {});
      const refresh_token = await req.jwt.sign({ sub: user.id, typ: 'refresh' }, {});
      return reply.send({ access_token, refresh_token, expires_in: app.jwt.options.sign?.expiresIn ?? 900 });
    },
  });

  router.post('/auth/code-verification', {
    schema: { body: CodeVerificationDto },
    handler: async (req, reply) => {
      const body = req.body as z.infer<typeof CodeVerificationDto>;
      const uc = container.resolve(VerifyCodeUseCase);
      const res = await uc.exec(body.token, body.code, (p, o) => req.jwt.sign(p, o));
      return reply.send(res);
    },
  });

  router.post('/auth/restore', {
    schema: { body: RestoreDto },
    handler: async (_req, reply) => {
      // staging is done in verification-service via UI/email; here just emit intent if needed.
      return reply.send({ ok: true });
    },
  });
}
