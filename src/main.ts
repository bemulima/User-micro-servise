import 'reflect-metadata';
import { buildApp } from './app.js';
import { env } from './config/env.js';
import AppDataSource from './infrastructure/orm/typeorm.config.js';
import { container } from './di/container.js';
import type { RabbitPort } from './domain/ports/rabbitmq.port.js';

if (!AppDataSource.isInitialized) {
  await AppDataSource.initialize();
}

const rabbit = container.resolve<RabbitPort>('RabbitPort');
await rabbit.init();

const app = await buildApp();
await app.listen({ port: env.PORT, host: '0.0.0.0' });

const shutdown = async () => {
  await app.close();
  await rabbit.close().catch(() => undefined);
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
