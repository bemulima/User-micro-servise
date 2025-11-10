import { UpdateProfileDto } from '../user.dto.js';

describe('user dto', () => {
  it('accepts partial profile updates', () => {
    const parsed = UpdateProfileDto.parse({
      display_name: 'Jane Doe',
      avatar_url: 'https://cdn.example.com/avatar.png',
    });

    expect(parsed).toEqual({
      display_name: 'Jane Doe',
      avatar_url: 'https://cdn.example.com/avatar.png',
    });
  });

  it('rejects invalid avatar urls and locales', () => {
    const result = UpdateProfileDto.safeParse({
      avatar_url: 'not-a-url',
      locale: 'e',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.format();
      expect(issues.avatar_url?._errors).toBeDefined();
      expect(issues.locale?._errors).toBeDefined();
    }
  });
});
