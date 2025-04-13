import Reservation from "../domain/Reservation";
import ReservationRepository from "../domain/adapters/ReservationRepository";
import ReservationCustomer from "../domain/ReservationCustomer";
import ReservationDate from "../domain/value-objects/ReservationDate";
import ReservationType from "../domain/value-objects/ReservationType";
import { CreateReservationDTO } from "./dto/CreateReservationDTO";
import ReservationUUID from "../domain/value-objects/ReservationUUID";
import ReservationCriteria from "../domain/criterea/ReservationCriteria";
import ReservationUUIDInvalidError from "../domain/errors/ReservationUUIDInvalidError";


export default class CreateReservationUseCase {
  constructor(private readonly repository: ReservationRepository) {}

  public async execute(input: CreateReservationDTO): Promise<void> {
    const customer = ReservationCustomer.fromPrimitives({
      name: input.customer.name.trim(),
      email: input.customer.email.trim(),
    });

    const date = ReservationDate.fromString(input.date.trim());
    const type = ReservationType.fromString(input.type.trim().toUpperCase());
    const uuid = ReservationUUID.fromString(input.uuid.trim());
    if((await this.repository.findByCriteria(ReservationCriteria.create({uuid}))).length !== 0){
      throw new ReservationUUIDInvalidError("UUID already exists");
    }

    const reservation = Reservation.create(uuid,customer, date, type);

    await this.repository.save(reservation);
  }
}
