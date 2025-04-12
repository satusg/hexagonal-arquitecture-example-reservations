import { uuidv7 } from "uuidv7";
import { faker } from "@faker-js/faker";
import Reservation, { ReservationPrimitives } from "../../../src/reservations/domain/Reservation";
import ReservationFactory from "./ReservationFactory";

export default class ReservationMother {
  public readonly uuid: string;
  public readonly customerName: string;
  public readonly customerEmail: string;
  public readonly date: string;
  public readonly type: string;
  public readonly reservationProps: ReservationPrimitives;
  public readonly defaultReservation: Reservation;

  constructor() {
    this.uuid = uuidv7();
    this.customerName = faker.person.firstName();
    this.customerEmail = faker.internet.email({ firstName: this.customerName });
    this.date = faker.date.future({ years: 1 }).toISOString(); // mejor que `.toString()`
    this.type = 'ONLINE';

    this.reservationProps = {
      uuid: this.uuid,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      date: this.date,
      type: this.type,
    };

    this.defaultReservation = Reservation.fromPrimitives(this.reservationProps);
  }

  static random(): Reservation {
    return ReservationFactory.generate();
  }

  static createWith(overrides: Partial<ReservationPrimitives>): Reservation {
    const props = {
      ...ReservationFactory.generatePrimitives(),
      ...overrides,
    };
    return Reservation.fromPrimitives(props);
  }

  static createPrimitivesWith(overrides?: Partial<ReservationPrimitives>): ReservationPrimitives {
    return {
      ...ReservationFactory.generatePrimitives(),
      ...overrides,
    };
  }
}
