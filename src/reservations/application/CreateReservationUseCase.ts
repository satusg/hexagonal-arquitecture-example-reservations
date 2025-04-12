import Reservation from "../domain/Reservation";
import ReservationRepository from "../domain/adapters/ReservationRepository";
import ReservationCustomer from "../domain/ReservationCustomer";
import ReservationDate from "../domain/value-objects/ReservationDate";
import ReservationType from "../domain/value-objects/ReservationType";
import { CreateReservationDTO } from "./dto/CreateReservattionDTO";
import ReservationUUID from "../domain/value-objects/ReservationUUID";


export default class CreateReservationUseCase {
  constructor(private readonly repository: ReservationRepository) {}

  public async execute(input: CreateReservationDTO): Promise<void> {
    const customer = ReservationCustomer.fromPrimitives({
      name: input.customerName.trim(),
      email: input.customerEmail.trim(),
    });

    const date = ReservationDate.fromString(input.date.trim());
    const type = ReservationType.fromString(input.type.trim().toUpperCase());
    const uuid = ReservationUUID.fromString(input.uuid.trim());
    const reservation = Reservation.create(uuid,customer, date, type);
    await this.repository.save(reservation);
  }
}
