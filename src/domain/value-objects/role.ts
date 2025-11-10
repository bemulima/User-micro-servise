import type { UserRole } from '../entities/user.js';

export const canModerator = (role: UserRole) =>
  role === 'moderator' || role === 'admin';
