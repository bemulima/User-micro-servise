export interface TempPayload {
  token: string;
  email: string;
  password_hash?: string | null;
  provider: 'local' | 'google' | 'github';
  created_at: string;
  expires_at: string;
}

export interface VerificationPort {
  storeTemporary(payload: TempPayload): Promise<void>;
  validateToken(token: string, code: string): Promise<TempPayload>;
}
