import { UserCreatedAtDateInvalidError } from '../errors/UserCreatedAtDateInvalidError';
import { UserCreatedAtDateInTheFutureError } from '../errors/UserCreatedAtDateInTheFutureError';

export class UserCreatedAtDate {
  constructor(private readonly value: Date) {
    this.validate();
  }
  private validate(): void {
    if (isNaN(this.value.getTime())) {
      throw new UserCreatedAtDateInvalidError('Invalid createdAt date.');
    }
    const currentDate = new Date();
    if (this.value > currentDate) {
      throw new UserCreatedAtDateInTheFutureError('createdAt date cannot be in the future.');
    }
  }

  public toString(): string {
    return this.value.toISOString();
  }

  public toDate(): Date {
    return this.value;
  }

  public static now(): UserCreatedAtDate {
    return new UserCreatedAtDate(new Date());
  }
}
