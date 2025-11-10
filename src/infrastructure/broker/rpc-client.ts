import { Channel, Connection, ConsumeMessage } from 'amqplib';
import { env } from '../../config/env.js';
import { randomUUID } from 'node:crypto';

export class RpcClient {
  constructor(private conn: Connection, private ch: Channel) {}

  async call<TReq extends object, TRes>(queue: string, req: TReq, timeoutMs = env.RPC_TIMEOUT_MS): Promise<TRes> {
    const corrId = randomUUID();
    const replyTo = env.RPC_REPLY_QUEUE;

    const payload = Buffer.from(JSON.stringify(req));
    const res = await new Promise<TRes>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('RPC_TIMEOUT')), timeoutMs);
      const onMessage = (msg: ConsumeMessage | null) => {
        if (!msg) return;
        if (msg.properties.correlationId !== corrId) return;
        clearTimeout(timer);
        this.ch.off('return', () => {});
        resolve(JSON.parse(msg.content.toString()) as TRes);
      };
      this.ch.consume(replyTo, onMessage, { noAck: true }).catch(reject);
      this.ch.sendToQueue(queue, payload, {
        correlationId: corrId,
        replyTo,
        contentType: 'application/json',
      });
    });

    return res;
  }
}
