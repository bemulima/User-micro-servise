import type { User } from '../entities/user.js';
import type { UserProfile } from '../entities/user-profile.js';

export interface UserRepoPort {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  createUser(u: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
  list(page: number, limit: number, role?: string): Promise<{ items: User[]; total: number }>;
  deleteById(id: string): Promise<void>;

  getProfile(userId: string): Promise<UserProfile | null>;
  upsertProfile(p: UserProfile): Promise<UserProfile>;
}
