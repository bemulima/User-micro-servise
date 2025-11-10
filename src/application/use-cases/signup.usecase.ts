import { inject, injectable } from 'tsyringe';
import { randomUUID } from 'node:crypto';
import type { VerificationPort, TempPayload } from '../../domain/ports/verification.port.js';
import type { UserRepoPort } from '../../domain/ports/user-repo.port.js';
import { hashPassword } from '../../infrastructure/crypto/argon2.service.js';
import { env } from '../../config/env.js';

@injectable()
export class SignupUseCase {
  constructor(
    @inject('VerificationPort') private verification: VerificationPort,
    @inject('UserRepo') private users: UserRepoPort,
  ) {}

  async exec(email: string, password?: string, provider: 'local' | 'google' | 'github' = 'local') {
    const e = email.toLowerCase();
    const exists = await this.users.findByEmail(e);
    if (exists) throw new Error('EMAIL_TAKEN');

    const token = randomUUID();
    const payload: TempPayload = {
      token,
      email: e,
      password_hash: password ? await hashPassword(password) : null,
      provider,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + env.VERIFICATION_TOKEN_TTL_SEC * 1000).toISOString(),
    };

    await this.verification.storeTemporary(payload);
    return { verification_token: token };
  }
}
