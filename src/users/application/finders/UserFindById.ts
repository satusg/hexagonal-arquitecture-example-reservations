import { UserNotFoundError } from '../../domain/errors/UserNotFoundError';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/User';
import { UserId } from '../../domain/value-objects/UserId.value-objects';

export class UserFindById {
  constructor(private readonly repository: UserRepository) {}

  public async execute(userId: UserId): Promise<User> {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new UserNotFoundError(`User with ID ${userId.toString()} not found`);
    }

    return user;
  }
}
