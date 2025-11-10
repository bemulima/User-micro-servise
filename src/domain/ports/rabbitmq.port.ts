export interface RabbitPort {
  publish(exchange: string, routingKey: string, msg: unknown): Promise<void>;
  rpc<TReq extends object, TRes>(queue: string, req: TReq, timeoutMs: number): Promise<TRes>;
  init(): Promise<void>;
  close(): Promise<void>;
}
