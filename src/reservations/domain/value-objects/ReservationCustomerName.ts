import ReservationCustomerNameInvalidError from "../errors/ReservationCustomerNameInvalidError";

export default class ReservationCustomerName {
  private constructor(private readonly name: string) {
    this.validate();
  }

  static fromString(name: string): ReservationCustomerName {
    return new ReservationCustomerName(name);
  }

  private validate(): void {
    if (this.name.trim().length === 0) {
      throw new ReservationCustomerNameInvalidError("The name should be at least one character long");
    }
  }

  getValue(): string {
    return this.name;
  }

  public equals(other: ReservationCustomerName): boolean {
    return this.name === other.name;
  }

  public toString(): string {
    return this.name;
  }
}
