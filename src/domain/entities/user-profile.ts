export interface UserProfile {
  userId: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  locale?: string | null;
  timezone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
