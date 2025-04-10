import ReservationCustomer from "./ReservationCustomer";
import ReservationDate from "./value-objects/ReservationDate";
import ReservationType from "./value-objects/ReservationType";
import ReservationUUID from "./value-objects/ReservationUUID";

export default class Reservation {
  private constructor(
    private readonly uuid: ReservationUUID,
    private readonly customer: ReservationCustomer,
    private readonly date: ReservationDate,
    private readonly type: ReservationType
  ) {}

  public static create(
    customer: ReservationCustomer,
    date: ReservationDate,
    type: ReservationType
  ): Reservation {
    const uuid = ReservationUUID.generate();
    return new Reservation(uuid, customer, date, type);
  }

  public static fromPrimitives(props: {
    uuid: string;
    customerName: string;
    customerEmail: string;
    date: string;
    type: string;
  }): Reservation {
    return new Reservation(
      ReservationUUID.fromString(props.uuid),
      ReservationCustomer.fromStrings(props.customerName, props.customerEmail),
      ReservationDate.fromString(props.date),
      ReservationType.fromString(props.type)
    );
  }

  public toPrimitives(): {
    uuid: string;
    customerName: string;
    customerEmail: string;
    date: string;
    type: string;
  } {
    return {
      uuid: this.uuid.toString(),
      customerName: this.customer.getName().getValue(),
      customerEmail: this.customer.getEmail().getValue(),
      date: this.date.toISOString(),
      type: this.type.toString(),
    };
  }

  public getUUID(): ReservationUUID {
    return this.uuid;
  }

  public getCustomer(): ReservationCustomer {
    return this.customer;
  }

  public getDate(): ReservationDate {
    return this.date;
  }

  public getType(): ReservationType {
    return this.type;
  }

  public equals(other: Reservation): boolean {
    return this.uuid.equals(other.uuid);
  }
}
