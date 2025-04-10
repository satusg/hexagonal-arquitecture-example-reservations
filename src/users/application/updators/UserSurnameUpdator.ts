import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/User';
import { UserId } from '../../domain/value-objects/UserId.value-objects';
import { UserSurname } from '../../domain/value-objects/UserSurname.value-objects';
import { UserBuilder } from '../builders/UserBuilder';
import { UserFindById } from '../finders/UserFindById';

export class UserSurnameUpdator {
  private userFindById: UserFindById;
  constructor(private readonly repository: UserRepository) {
    this.userFindById = new UserFindById(this.repository);
  }
  public async execute(userId: UserId, newSurname: UserSurname): Promise<User> {
    const user = await this.userFindById.execute(userId);

    if (user.surname === newSurname) {
      return user;
    }

    const updatedUser = UserBuilder.fromUser(user).setSurname(newSurname).build();

    await this.repository.save(updatedUser);

    return updatedUser;
  }
}
