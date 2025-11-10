import { z } from 'zod';

export const SignupDto = z.object({
  email: z.string().email(),
  password: z.string().min(8).optional(),
  provider: z.enum(['local', 'google', 'github']).optional().default('local'),
});

export const SigninDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const CodeVerificationDto = z.object({
  token: z.string().min(8),
  code: z.string().min(4).max(10),
});

export const RestoreDto = z.object({
  email: z.string().email(),
});
