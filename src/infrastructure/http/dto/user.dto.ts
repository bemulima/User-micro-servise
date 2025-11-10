import { z } from 'zod';

export const UpdateProfileDto = z.object({
  display_name: z.string().min(1).max(120).optional(),
  avatar_url: z.string().url().optional(),
  locale: z.string().min(2).max(10).optional(),
  timezone: z.string().min(1).max(60).optional(),
});
