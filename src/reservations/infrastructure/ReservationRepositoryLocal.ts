import ReservationRepository from "../domain/adapters/ReservationRepository";
import Reservation from "../domain/Reservation";
import ReservationUUID from "../domain/value-objects/ReservationUUID";

export default class ReservationRepositoryLocal implements ReservationRepository {
  private reservations: Map<string, Reservation>;

  constructor() {
    this.reservations = new Map();
  }

  async save(reservation: Reservation): Promise<void> {
    this.reservations.set(reservation.getUUID().toString(), reservation);
  }

  async findByUUID(uuid: ReservationUUID): Promise<Reservation | null> {
    const reservation = this.reservations.get(uuid.toString());
    return reservation || null;
  }

  async findAll(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }

  async delete(uuid: ReservationUUID): Promise<void> {
    this.reservations.delete(uuid.toString());
  }
}
