import { CodeVerificationDto, RestoreDto, SigninDto, SignupDto } from '../auth.dto.js';

describe('auth dto', () => {
  it('accepts valid signup payloads and defaults provider to local', () => {
    const parsed = SignupDto.parse({ email: 'user@example.com' });

    expect(parsed).toEqual({ email: 'user@example.com', provider: 'local' });
  });

  it('rejects invalid signup email and short passwords', () => {
    const result = SignupDto.safeParse({ email: 'invalid-email', password: 'short' });

    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.format();
      expect(issues.email?._errors).toBeDefined();
      expect(issues.password?._errors).toBeDefined();
    }
  });

  it('validates signin credentials', () => {
    expect(() => SigninDto.parse({ email: 'user@example.com', password: 'password123' })).not.toThrow();
    expect(SigninDto.safeParse({ email: 'user@example.com', password: 'short' }).success).toBe(false);
  });

  it('enforces verification code and token lengths', () => {
    expect(() => CodeVerificationDto.parse({ token: 'abcdefghi', code: '1234' })).not.toThrow();
    expect(CodeVerificationDto.safeParse({ token: 'short', code: '1' }).success).toBe(false);
  });

  it('validates restore request emails', () => {
    expect(() => RestoreDto.parse({ email: 'user@example.com' })).not.toThrow();
    expect(RestoreDto.safeParse({ email: 'not-an-email' }).success).toBe(false);
  });
});
