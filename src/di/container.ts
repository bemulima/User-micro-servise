import 'reflect-metadata';
import { container } from 'tsyringe';
import type { VerificationPort } from '../domain/ports/verification.port.js';
import { VerificationRpcAdapter } from '../infrastructure/verification/verification.rpc.adapter.js';
import type { RabbitPort } from '../domain/ports/rabbitmq.port.js';
import { RabbitMqAdapter } from '../infrastructure/broker/rabbitmq.adapter.js';
import type { UserRepoPort } from '../domain/ports/user-repo.port.js';
import { TypeormUserRepository } from '../infrastructure/orm/repositories/user.repository.js';

container.registerSingleton<VerificationPort>('VerificationPort', VerificationRpcAdapter);
container.registerSingleton<RabbitPort>('RabbitPort', RabbitMqAdapter);
container.registerSingleton<UserRepoPort>('UserRepo', TypeormUserRepository);

export { container };
