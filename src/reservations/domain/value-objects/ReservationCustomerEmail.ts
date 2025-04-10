import ReservationCustomerEmailInvalidError from "../errors/ReservationCustomerEmailInvalidError";

export default class ReservationCustomerEmail {
  private constructor(private readonly email: string) {
    this.email = this.email.toLowerCase();
    this.validate();
  }

  static fromString(email: string): ReservationCustomerEmail {
    return new ReservationCustomerEmail(email);
  }

  private validate(): void {
    if (!this.email || this.email.trim().length === 0) {
      throw new ReservationCustomerEmailInvalidError("No email has been provided.");
    }
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    if (!emailRegex.test(this.email)) {
      throw new ReservationCustomerEmailInvalidError("The email format is not valid.");
    }
  }

  getValue(): string {
    return this.email;
  }

  public equals(other: ReservationCustomerEmail): boolean {
    return this.email === other.email;
  }

  public toString(): string {
    return this.email;
  }
}
