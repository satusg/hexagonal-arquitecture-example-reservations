import ReservationCustomer from "./ReservationCustomer";
import ReservationDate from "./value-objects/ReservationDate";
import ReservationType from "./value-objects/ReservationType";
import ReservationUUID from "./value-objects/ReservationUUID";

export type ReservationPrimitives = {
  uuid: string;
  customerName: string;
  customerEmail: string;
  date: string;
  type: string;
};

export default class Reservation {
  protected constructor(
    private readonly id: ReservationUUID,
    private readonly customer: ReservationCustomer,
    private readonly date: ReservationDate,
    private readonly type: ReservationType
  ) { }

  public isPast(): boolean {
    return this.date.isBeforeNow();
  }

  public static create(
    uuid: ReservationUUID,
    customer: ReservationCustomer,
    date: ReservationDate,
    type: ReservationType
  ): Reservation {
    return new Reservation(uuid, customer, date, type);
  }
  public static createWithId(
    uuid: ReservationUUID,
    customer: ReservationCustomer,
    date: ReservationDate,
    type: ReservationType
  ): Reservation {
    return new Reservation(uuid, customer, date, type);
  }
  public static fromPrimitives(props: ReservationPrimitives): Reservation {
    return new Reservation(
      ReservationUUID.fromString(props.uuid),
      ReservationCustomer.fromPrimitives({
        name: props.customerName,
        email: props.customerEmail,
      }),
      ReservationDate.fromString(props.date),
      ReservationType.fromString(props.type)
    );
  }

  public toPrimitives(): ReservationPrimitives {
    return {
      uuid: this.id.toString(),
      customerName: this.customer.getName().getValue(),
      customerEmail: this.customer.getEmail().getValue(),
      date: this.date.toISOString(),
      type: this.type.toString(),
    };
  }
  public toJSON(): ReservationPrimitives {
    return this.toPrimitives();
  }

  public getId(): ReservationUUID {
    return this.id;
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
    return this.id.equals(other.id);
  }
}
