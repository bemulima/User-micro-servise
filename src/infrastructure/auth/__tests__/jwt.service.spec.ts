import type { FastifyInstance } from 'fastify';

describe('registerJwt', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://user:pass@localhost:5432/db';
    process.env.RABBITMQ_URL = process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  async function importRegisterJwt() {
    (jest as any).unstable_mockModule('@fastify/jwt', () => ({ default: jest.fn() }));
    const module = await import('../jwt.service');
    return module.registerJwt;
  }

  it('registers HS256 secret when JWT_SECRET provided', async () => {
    process.env.JWT_ALG = 'HS256';
    process.env.JWT_SECRET = 'super-secret';
    process.env.JWT_ACCESS_TTL = '123';

    const registerJwt = await importRegisterJwt();
    const app: Pick<FastifyInstance, 'register'> = {
      register: jest.fn(),
    } as any;

    registerJwt(app as FastifyInstance);

    expect(app.register).toHaveBeenCalledTimes(1);
    const [, options] = (app.register as jest.Mock).mock.calls[0];
    expect(options).toMatchObject({
      sign: { algorithm: 'HS256', expiresIn: 123 },
      secret: 'super-secret',
    });
  });

  it('throws when HS256 secret is missing', async () => {
    process.env.JWT_ALG = 'HS256';
    delete process.env.JWT_SECRET;

    const registerJwt = await importRegisterJwt();
    const app: Pick<FastifyInstance, 'register'> = {
      register: jest.fn(),
    } as any;

    expect(() => registerJwt(app as FastifyInstance)).toThrow('JWT_SECRET required for HS256');
    expect(app.register).not.toHaveBeenCalled();
  });

  it('registers RSA keys when RS256 configured', async () => {
    process.env.JWT_ALG = 'RS256';
    process.env.JWT_PRIVATE_KEY = 'PRIVATE_KEY_CONTENT';
    process.env.JWT_PUBLIC_KEY = 'PUBLIC_KEY_CONTENT';
    process.env.JWT_ACCESS_TTL = '3600';

    const registerJwt = await importRegisterJwt();
    const app: Pick<FastifyInstance, 'register'> = {
      register: jest.fn(),
    } as any;

    registerJwt(app as FastifyInstance);

    const [, options] = (app.register as jest.Mock).mock.calls[0];
    expect(options).toMatchObject({
      sign: { algorithm: 'RS256', expiresIn: 3600 },
      secret: {
        private: 'PRIVATE_KEY_CONTENT',
        public: 'PUBLIC_KEY_CONTENT',
        format: 'pem',
        passphrase: '',
      },
    });
  });
});
