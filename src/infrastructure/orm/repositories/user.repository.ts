import { injectable } from 'tsyringe';
import AppDataSource from '../typeorm.config.js';
import { UserOrm } from '../entities/user.orm.js';
import { UserProfileOrm } from '../entities/user-profile.orm.js';
import type { UserRepoPort } from '../../../domain/ports/user-repo.port.js';
import type { User } from '../../../domain/entities/user.js';
import type { UserProfile } from '../../../domain/entities/user-profile.js';

@injectable()
export class TypeormUserRepository implements UserRepoPort {
  private async ensureInit() {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  }

  private mapUser(entity: UserOrm): User {
    return {
      id: entity.id,
      email: entity.email,
      passwordHash: entity.passwordHash,
      role: entity.role,
      status: entity.status,
      provider: entity.provider,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private mapProfile(entity: UserProfileOrm): UserProfile {
    return {
      userId: entity.userId,
      displayName: entity.displayName,
      avatarUrl: entity.avatarUrl,
      locale: entity.locale,
      timezone: entity.timezone,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    await this.ensureInit();
    const repo = AppDataSource.getRepository(UserOrm);
    const entity = await repo.findOne({ where: { email } });
    return entity ? this.mapUser(entity) : null;
  }

  async findById(id: string): Promise<User | null> {
    await this.ensureInit();
    const repo = AppDataSource.getRepository(UserOrm);
    const entity = await repo.findOne({ where: { id } });
    return entity ? this.mapUser(entity) : null;
  }

  async createUser(u: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User> {
    await this.ensureInit();
    const repo = AppDataSource.getRepository(UserOrm);
    const created = repo.create({
      id: u.id,
      email: u.email,
      passwordHash: u.passwordHash,
      role: u.role,
      status: u.status,
      provider: u.provider,
    });
    const saved = await repo.save(created);
    return this.mapUser(saved);
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.ensureInit();
    const repo = AppDataSource.getRepository(UserOrm);
    await repo.update({ id }, { passwordHash });
  }

  async list(page: number, limit: number, role?: string): Promise<{ items: User[]; total: number }> {
    await this.ensureInit();
    const repo = AppDataSource.getRepository(UserOrm);
    const take = Math.max(1, limit);
    const skip = Math.max(0, page - 1) * take;
    const where = role ? { role } : {};
    const [entities, total] = await repo.findAndCount({ where, take, skip, order: { createdAt: 'DESC' } });
    return { items: entities.map((e) => this.mapUser(e)), total };
  }

  async deleteById(id: string): Promise<void> {
    await this.ensureInit();
    const repo = AppDataSource.getRepository(UserOrm);
    await repo.delete({ id });
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    await this.ensureInit();
    const repo = AppDataSource.getRepository(UserProfileOrm);
    const entity = await repo.findOne({ where: { userId } });
    return entity ? this.mapProfile(entity) : null;
  }

  async upsertProfile(p: UserProfile): Promise<UserProfile> {
    await this.ensureInit();
    const repo = AppDataSource.getRepository(UserProfileOrm);
    const entity = repo.create({
      userId: p.userId,
      displayName: p.displayName ?? null,
      avatarUrl: p.avatarUrl ?? null,
      locale: p.locale ?? null,
      timezone: p.timezone ?? null,
    });
    const saved = await repo.save(entity);
    return this.mapProfile(saved);
  }
}
