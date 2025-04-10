import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserDateOfBirth } from '../../domain/value-objects/UserDateOfBirth.value-objects';
import { UserId } from '../../domain/value-objects/UserId.value-objects';
import { UserBuilder } from '../builders/UserBuilder';
import { UserFindById } from '../finders/UserFindById';

export class UserDateOfBirthUpdator {
  private userFindById: UserFindById;
  constructor(private readonly repository: UserRepository) {
    this.userFindById = new UserFindById(this.repository);
  }
  public async execute(userId: UserId, dateOfBirth: UserDateOfBirth) {
    const user = await this.userFindById.execute(userId);
    if (dateOfBirth === user.dateOfBirth) {
      return user;
    }
    const updatedUser = UserBuilder.fromUser(user).setDateOfBirth(dateOfBirth).build();

    await this.repository.save(updatedUser);

    return updatedUser;
  }
}
