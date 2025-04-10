import ReservationCustomerName from "./value-objects/ReservationCustomerName";
import ReservationCustomerEmail from "./value-objects/ReservationCustomerEmail";

export default class ReservationCustomer {
  private constructor(
    private readonly name: ReservationCustomerName,
    private readonly email: ReservationCustomerEmail
  ) {}
  
  public static create(
    name: ReservationCustomerName,
    email: ReservationCustomerEmail
  ): ReservationCustomer {
    return new ReservationCustomer(name, email);
  }

  static fromStrings(name: string, email: string): ReservationCustomer {
    return new ReservationCustomer(
      ReservationCustomerName.fromString(name),
      ReservationCustomerEmail.fromString(email)
    );
  }

  getName(): ReservationCustomerName {
    return this.name;
  }

  getEmail(): ReservationCustomerEmail {
    return this.email;
  }

  equals(other: ReservationCustomer): boolean {
    return (
      this.name.equals(other.name) && this.email.equals(other.email)
    );
  }

  toPrimitives(): { name: string; email: string } {
    return {
      name: this.name.getValue(),
      email: this.email.getValue(),
    };
  }
}
