export type UserProvider = 'local' | 'google' | 'github';
export type UserRole = 'user' | 'moderator' | 'admin';
export type UserStatus = 'active' | 'blocked';

export interface User {
  id: string;
  email: string;
  passwordHash: string | null;
  role: UserRole;
  status: UserStatus;
  provider: UserProvider;
  createdAt: Date;
  updatedAt: Date;
}
