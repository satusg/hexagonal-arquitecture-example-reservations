import ReservationUUID from "../value-objects/ReservationUUID";
import ReservationType from "../value-objects/ReservationType";
import ReservationDate from "../value-objects/ReservationDate";
import ReservationCustomerEmail from "../value-objects/ReservationCustomerEmail";
import ReservationCustomerName from "../value-objects/ReservationCustomerName";

export default class ReservationCriteria {
  private constructor(
    public readonly uuid?: ReservationUUID,
    public readonly type?: ReservationType,
    public readonly date?: {
      from?: ReservationDate,
      to?: ReservationDate,
    },
    public readonly customer?: {
      email?: ReservationCustomerEmail,
      name?: ReservationCustomerName,
    },
  ) { }

  static create(props?: {
    uuid?: ReservationUUID,
    type?: ReservationType,
    date?: {
      from?: ReservationDate,
      to?: ReservationDate,
    },
    customer?: {
      email?: ReservationCustomerEmail,
      name?: ReservationCustomerName,
    },
  }): ReservationCriteria {
    return new ReservationCriteria(props?.uuid, props?.type, props?.date,props?.customer);
  }
  static createFromPrimitives(props: {
    uuid?: string;
    type?: string;
    date?: {
      from?: string,
      to?: string,
    }
    customer?: {
      email?: string,
      name?: string,
    };
  }): ReservationCriteria {
    return new ReservationCriteria(
      props.uuid ? ReservationUUID.fromString(props.uuid) : undefined,
      props.type ? ReservationType.fromString(props.type) : undefined,
      props.date ? {
        from: props.date.from ? ReservationDate.fromString(props.date.from) : undefined,
        to: props.date.to ? ReservationDate.fromString(props.date.to) : undefined
      }: undefined,
      props.customer ? {
        email : props.customer.email ? ReservationCustomerEmail.fromString(props.customer.email) : undefined,
        name: props.customer.name ? ReservationCustomerName.fromString(props.customer.name): undefined
      }: undefined,
    );
  }



  hasUUID(): boolean {
    return !!this.uuid;
  }

  hasType(): boolean {
    return !!this.type;
  }

  hasDateRange(): boolean {
    return !!this.date?.from || !!this.date?.to;
  }
}
