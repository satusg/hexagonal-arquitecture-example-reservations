import Reservation from "../domain/Reservation";
import ReservationRepository from "../domain/adapters/ReservationRepository";
import ReservationCustomer from "../domain/ReservationCustomer";
import ReservationDate from "../domain/value-objects/ReservationDate";
import ReservationType from "../domain/value-objects/ReservationType";

export default class CreateReservationUseCase {
  constructor(private readonly repository: ReservationRepository) {}

  public async execute(input: {
    customerName: string;
    customerEmail: string;
    date: string;
    type: string;
  }): Promise<Reservation> {
    const customer = ReservationCustomer.fromStrings(input.customerName, input.customerEmail);
    const date = ReservationDate.fromString(input.date);
    const type = ReservationType.fromString(input.type);
    const reservation = Reservation.create(customer, date, type);
    await this.repository.save(reservation);
    return reservation;
  }
}
