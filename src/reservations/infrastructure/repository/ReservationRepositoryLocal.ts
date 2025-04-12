import ReservationRepository from "../../domain/adapters/ReservationRepository";
import ReservationCriteria from "../../domain/criterea/ReservationCriteria";
import Reservation from "../../domain/Reservation";
import ReservationUUID from "../../domain/value-objects/ReservationUUID";

export default class ReservationRepositoryLocal implements ReservationRepository {
  private reservations: Map<string, Reservation>;

  constructor() {
    this.reservations = new Map();
  }
  async findByCriteria(criteria: ReservationCriteria): Promise<Reservation[]> {
    let results = [...this.reservations.values()];
    
    if (criteria.uuid) {
      results = results.filter(reservation =>
        reservation.getId().equals(criteria.uuid));
    }
    if (criteria.hasType()) {
      results = results.filter(reservation =>
        reservation.getType().equals(criteria.type)
      );
    }
  
    if (criteria.dateFrom) {
      results = results.filter(reservation =>
        reservation.getDate().getValue().getTime() >= criteria.dateFrom!.getValue().getTime()
      );
    }
  
    if (criteria.dateTo) {
      results = results.filter(reservation =>
        reservation.getDate().getValue().getTime() <= criteria.dateTo!.getValue().getTime()
      );
    }
  
    return results;
  }
  
  async save(reservation: Reservation): Promise<void> {
    this.reservations.set(reservation.getId().toString(), reservation);
  }
  
  async delete(uuid: ReservationUUID): Promise<void> {
    this.reservations.delete(uuid.toString());
  }

}
