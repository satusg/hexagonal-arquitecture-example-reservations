import ReservationUUID from "../value-objects/ReservationUUID";
import ReservationType from "../value-objects/ReservationType";
import ReservationDate from "../value-objects/ReservationDate";

export default class ReservationCriteria {
  constructor(
    public readonly uuid?: ReservationUUID,
    public readonly type?: ReservationType,
    public readonly dateFrom?: ReservationDate,
    public readonly dateTo?: ReservationDate
  ) {}

  static create(props: {
    uuid?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  }): ReservationCriteria {
    return new ReservationCriteria(
      props.uuid ? ReservationUUID.fromString(props.uuid) : undefined,
      props.type ? ReservationType.fromString(props.type) : undefined,
      props.dateFrom ? ReservationDate.fromString(props.dateFrom) : undefined,
      props.dateTo ? ReservationDate.fromString(props.dateTo) : undefined
    );
  }

  hasUUID(): boolean {
    return !!this.uuid;
  }

  hasType(): boolean {
    return !!this.type;
  }

  hasDateRange(): boolean {
    return !!this.dateFrom || !!this.dateTo;
  }
}
