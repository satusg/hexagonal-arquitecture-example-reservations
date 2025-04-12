import ReservationCriteria from "../criterea/ReservationCriteria";
import Reservation from "../Reservation";
import ReservationUUID from "../value-objects/ReservationUUID";

export default interface ReservationRepository {
  save(reservation: Reservation): Promise<void>;
  findByCriteria(criteria: ReservationCriteria): Promise<Reservation[]>;
  delete(uuid: ReservationUUID): Promise<void>;
}
