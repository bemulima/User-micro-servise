import { injectable } from 'tsyringe';
import type { VerificationPort, TempPayload } from '../../domain/ports/verification.port.js';
import type { RabbitPort } from '../../domain/ports/rabbitmq.port.js';
import { container } from '../../di/container.js';
import { env } from '../../config/env.js';

@injectable()
export class VerificationRpcAdapter implements VerificationPort {
  private rabbit = container.resolve<RabbitPort>('RabbitPort');

  async storeTemporary(payload: TempPayload): Promise<void> {
    await this.rabbit.rpc('verification.store', payload, env.RPC_TIMEOUT_MS);
  }

  async validateToken(token: string, code: string): Promise<TempPayload> {
    return this.rabbit.rpc('verification.validate', { token, code }, env.RPC_TIMEOUT_MS);
  }
}
