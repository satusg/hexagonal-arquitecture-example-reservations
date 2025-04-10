import { User } from '../../domain/User';
import { UserId } from '../../domain/value-objects/UserId.value-objects';
import { UserName } from '../../domain/value-objects/UserName.value-objects';
import { UserSurname } from '../../domain/value-objects/UserSurname.value-objects';
import { UserEmail } from '../../domain/value-objects/UserEmail.value-objects';
import { UserDateOfBirth } from '../../domain/value-objects/UserDateOfBirth.value-objects';
import { UserCreatedAtDate } from '../../domain/value-objects/UserCreatedAtDate.value-objects';
import { UserUpdatedAtDate } from '../../domain/value-objects/UserUpdatedAtDate.value-objects';

export class UserBuilder {
  private id: UserId;
  private name: UserName;
  private surname: UserSurname;
  private email: UserEmail;
  private dateOfBirth: UserDateOfBirth;
  private createdAt: UserCreatedAtDate;
  private updatedAt: UserUpdatedAtDate;

  public constructor(
    id: UserId,
    name: UserName,
    surname: UserSurname,
    email: UserEmail,
    dateOfBirth: UserDateOfBirth,
    createdAt: UserCreatedAtDate
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.dateOfBirth = dateOfBirth;
    this.createdAt = createdAt;
    this.updatedAt = UserUpdatedAtDate.now();
  }

  public static fromUser(user: User): UserBuilder {
    const builder = new UserBuilder(user.id, user.name, user.surname, user.email, user.dateOfBirth, user.createdAt);
    builder.updatedAt = user.updatedAt;
    return builder;
  }

  public setName(name: UserName): UserBuilder {
    this.name = name;
    this.updatedAt = UserUpdatedAtDate.now();
    return this;
  }

  public setSurname(surname: UserSurname): UserBuilder {
    this.surname = surname;
    this.updatedAt = UserUpdatedAtDate.now();
    return this;
  }

  public setEmail(email: UserEmail): UserBuilder {
    this.email = email;
    this.updatedAt = UserUpdatedAtDate.now();
    return this;
  }

  public setDateOfBirth(dateOfBirth: UserDateOfBirth): UserBuilder {
    this.dateOfBirth = dateOfBirth;
    this.updatedAt = UserUpdatedAtDate.now();
    return this;
  }

  public build(): User {
    return new User(this.id, this.name, this.surname, this.email, this.dateOfBirth, this.createdAt, this.updatedAt);
  }
}
