import { inject, injectable } from 'tsyringe';
import type { VerificationPort } from '../../domain/ports/verification.port.js';
import type { UserRepoPort } from '../../domain/ports/user-repo.port.js';
import type { RabbitPort } from '../../domain/ports/rabbitmq.port.js';
import { randomUUID } from 'node:crypto';

@injectable()
export class VerifyCodeUseCase {
  constructor(
    @inject('VerificationPort') private verification: VerificationPort,
    @inject('UserRepo') private users: UserRepoPort,
    @inject('RabbitPort') private rabbit: RabbitPort,
  ) {}

  async exec(token: string, code: string, jwtSign: (payload: any, opts?: any) => Promise<string>) {
    const payload = await this.verification.validateToken(token, code);
    const exists = await this.users.findByEmail(payload.email);
    if (exists) throw new Error('EMAIL_TAKEN');

    const created = await this.users.createUser({
      id: randomUUID(),
      email: payload.email,
      passwordHash: payload.password_hash ?? null,
      role: 'user',
      status: 'active',
      provider: payload.provider,
    } as any);

    await this.rabbit.publish('events', 'events.user.created', {
      user_id: created.id,
      email: created.email,
      provider: created.provider,
      created_at: new Date().toISOString(),
    });

    const access_token = await jwtSign({ sub: created.id, role: created.role }, { expiresIn: undefined });
    const refresh_token = await jwtSign({ sub: created.id, typ: 'refresh' }, { expiresIn: undefined });
    return { user_id: created.id, access_token, refresh_token };
  }
}
