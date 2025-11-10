import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1710000000000 implements MigrationInterface {
  name = 'Init1710000000000';

  public async up(qr: QueryRunner): Promise<void> {
    await qr.query(`CREATE EXTENSION IF NOT EXISTS citext;`);
    await qr.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email citext NOT NULL UNIQUE,
        password_hash text NULL,
        role text NOT NULL DEFAULT 'user',
        status text NOT NULL DEFAULT 'active',
        provider text NOT NULL DEFAULT 'local',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `);
    await qr.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        user_id uuid PRIMARY KEY,
        display_name text NULL,
        avatar_url text NULL,
        locale text NULL,
        timezone text NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    await qr.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));`);
  }

  public async down(qr: QueryRunner): Promise<void> {
    await qr.query(`DROP INDEX IF EXISTS idx_users_email_lower;`);
    await qr.query(`DROP TABLE IF EXISTS user_profiles;`);
    await qr.query(`DROP TABLE IF EXISTS users;`);
  }
}
