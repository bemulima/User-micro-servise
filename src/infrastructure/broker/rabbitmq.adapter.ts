import amqplib, { Channel, Connection } from 'amqplib';
import { env } from '../../config/env.js';
import type { RabbitPort } from '../../domain/ports/rabbitmq.port.js';
import { RpcClient } from './rpc-client.js';

export class RabbitMqAdapter implements RabbitPort {
  private conn!: Connection;
  private ch!: Channel;
  private rpc!: RpcClient;

  async init(): Promise<void> {
    this.conn = await amqplib.connect(env.RABBITMQ_URL);
    this.ch = await this.conn.createChannel();
    await this.ch.prefetch(env.RABBITMQ_PREFETCH);
    this.rpc = new RpcClient(this.conn, this.ch);
  }

  async publish(exchange: string, routingKey: string, msg: unknown): Promise<void> {
    const payload = Buffer.from(JSON.stringify(msg));
    await this.ch.assertExchange(exchange, 'topic', { durable: true });
    this.ch.publish(exchange, routingKey, payload, { contentType: 'application/json', persistent: true });
  }

  async rpc<TReq extends object, TRes>(queue: string, req: TReq, timeoutMs: number): Promise<TRes> {
    return this.rpc.call<TReq, TRes>(queue, req, timeoutMs);
  }

  async close(): Promise<void> {
    await this.ch.close();
    await this.conn.close();
  }
}
