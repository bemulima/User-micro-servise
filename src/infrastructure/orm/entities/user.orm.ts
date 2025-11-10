import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserOrm {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_users_email_lower', { unique: true })
  @Column({ type: 'citext' })
  email!: string;

  @Column({ type: 'text', nullable: true, name: 'password_hash' })
  passwordHash!: string | null;

  @Column({ type: 'text', default: 'user' })
  role!: 'user' | 'moderator' | 'admin';

  @Column({ type: 'text', default: 'active' })
  status!: 'active' | 'blocked';

  @Column({ type: 'text', default: 'local' })
  provider!: 'local' | 'google' | 'github';

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
