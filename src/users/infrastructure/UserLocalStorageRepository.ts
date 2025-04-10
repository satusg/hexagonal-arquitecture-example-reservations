import { UserRepository } from '../domain/repositories/UserRepository';
import { User } from '../domain/User';
import { UserEmail } from '../domain/value-objects/UserEmail.value-objects';
import { UserId } from '../domain/value-objects/UserId.value-objects';

export default class UserLocalStorageRepository implements UserRepository {
  private users: Map<string, User>;
  private emails: Map<string, User>;

  constructor() {
    this.users = new Map<string, User>();
    this.emails = new Map<string, User>();
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id.toString(), user);
    this.emails.set(user.email.toString(), user);
  }

  async delete(userId: UserId): Promise<void> {
    const user = this.users.get(userId.toString());
    if (!user) {
      return;
    }
    this.users.delete(userId.toString());
    this.emails.delete(user.email.toString());
  }

  async findById(userId: UserId): Promise<User | null> {
    return this.users.get(userId.toString()) || null;
  }

  async findByEmail(email: UserEmail): Promise<User | null> {
    return this.emails.get(email.toString()) || null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}
