import { UserDateOfBirthInTheFutureError } from '../errors/UserDateOfBirthInTheFutureError';
import { UserDateOfBirthInvalidError } from '../errors/UserDateOfBirthInvalidError';
import { UserUnderageError } from '../errors/UserUnderageError';

export const UNDER_AGE_VALUE = 18;
export class UserDateOfBirth {
  private readonly age: number;

  constructor(private readonly value: Date) {
    this.age = this.calculateAge(new Date());
    this.validate();
  }

  public toString(): string {
    return this.value.toISOString();
  }

  public toDate(): Date {
    return this.value;
  }

  public getAge(): number {
    return this.age;
  }

  private validate(): void {
    if (isNaN(this.value.getTime())) {
      throw new UserDateOfBirthInvalidError('The date of birth is not a valid date.');
    }
    const today = new Date();
    if (this.value > today) {
      throw new UserDateOfBirthInTheFutureError('The date of birth cannot be in the future.');
    }
    if (this.age < UNDER_AGE_VALUE) {
      throw new UserUnderageError('User must be at least 18 years old.');
    }
  }

  private calculateAge(today: Date): number {
    let age = today.getFullYear() - this.value.getFullYear();
    const month = today.getMonth() - this.value.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < this.value.getDate())) {
      age--;
    }
    return age;
  }
}
