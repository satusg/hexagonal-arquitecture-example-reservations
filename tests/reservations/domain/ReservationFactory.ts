import { faker } from "@faker-js/faker";
import Reservation from "../../../src/reservations/domain/Reservation";
import ReservationCustomer from "../../../src/reservations/domain/ReservationCustomer";
import ReservationCustomerName from "../../../src/reservations/domain/value-objects/ReservationCustomerName";
import ReservationCustomerEmail from "../../../src/reservations/domain/value-objects/ReservationCustomerEmail";
import ReservationDate from "../../../src/reservations/domain/value-objects/ReservationDate";
import ReservationType from "../../../src/reservations/domain/value-objects/ReservationType";
import ReservationUUID from "../../../src/reservations/domain/value-objects/ReservationUUID";
import { ReservationPrimitives } from "../../../src/reservations/domain/Reservation";
import { uuidv7 } from "uuidv7";

export default class ReservationFactory {
  static generate(overrides: Partial<ReservationPrimitives> = {}): Reservation {
    const firstName = faker.person.firstName();

    const uuid = overrides.uuid
      ? ReservationUUID.fromString(overrides.uuid)
      : ReservationUUID.generate();

    const name = ReservationCustomerName.fromString(
      overrides.customer?.name ?? firstName
    );
    const email = ReservationCustomerEmail.fromString(
      overrides.customer?.email ?? faker.internet.email({ firstName })
    );
    const customer = ReservationCustomer.create(name, email);

    const date = ReservationDate.fromString(
      overrides.date ?? faker.date.future({ years: 1 }).toISOString()
    );

    const type = ReservationType.fromString(overrides.type ?? "ONLINE");
    
    return Reservation.createWithId(uuid,customer, date, type);
  }

  static generatePrimitives(overrides: Partial<ReservationPrimitives> = {}): ReservationPrimitives {
    const firstName = faker.person.firstName();

    return {
      uuid: overrides.uuid ?? uuidv7(),
      customer: {
        name: (overrides.customer?.name ?? firstName).trim(),
        email: (overrides.customer?.email ?? faker.internet.email({ firstName })).trim().toLowerCase(),
      },
      date: (overrides.date ?? faker.date.future({ years: 1 }).toISOString()).trim(),
      type: (overrides.type ?? "ONLINE").trim()
    };
  }

  static generateMany(count: number, overrides?: Partial<ReservationPrimitives>): Reservation[] {
    return Array.from({ length: count }, () => this.generate(overrides));
  }

  static generateManyPrimitives(count: number, overrides?: Partial<ReservationPrimitives>): ReservationPrimitives[] {
    return Array.from({ length: count }, () => this.generatePrimitives(overrides));
  }
}
