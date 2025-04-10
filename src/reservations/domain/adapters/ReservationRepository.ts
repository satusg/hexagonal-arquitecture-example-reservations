import Reservation from "../Reservation";
import ReservationUUID from "../value-objects/ReservationUUID";

export default interface ReservationRepository {
  save(reservation: Reservation): Promise<void>;
  findByUUID(uuid: ReservationUUID): Promise<Reservation | null>;
  findAll(): Promise<Reservation[]>;
  delete(uuid: ReservationUUID): Promise<void>;
}
