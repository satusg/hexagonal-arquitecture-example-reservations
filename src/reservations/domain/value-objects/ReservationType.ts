import ReservationTypeInvalidError from "../errors/ReservationTypeInvalidError";

export default class ReservationType {
  private constructor(private readonly value: string) {}

  private static readonly TYPES = new Map<string, ReservationType>([
    ['ONLINE', new ReservationType('ONLINE')],
    ['IN_PERSON', new ReservationType('IN_PERSON')],
    ['PHONE', new ReservationType('PHONE')],
  ]);

  static fromString(value: string): ReservationType {
    const key = value.toUpperCase();
    const type = this.TYPES.get(key);
    if (!type) {
      throw new ReservationTypeInvalidError(`Invalid ReservationType: ${value}`);
    }
    return type;
  }

  static values(): ReservationType[] {
    return Array.from(this.TYPES.values());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ReservationType): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
