import ReservationRepository from "../domain/adapters/ReservationRepository";
import ReservationCriteria from "../domain/criterea/ReservationCriteria";
import Reservation from "../domain/Reservation";
import { RetrieveReservationDTO } from "./dto/RetrieveReservationDTO";



export default class RetrieveReservationsByCriteriaUseCase {
  constructor(private readonly repository: ReservationRepository) {}

  async execute(input: RetrieveReservationDTO): Promise<Reservation[]> {
    const criteria = ReservationCriteria.create({
      uuid: input.uuid?.trim(),
      type: input.type?.trim(),
      dateFrom: input.dateFrom?.trim(),
      dateTo: input.dateTo?.trim(),
    });


    return await this.repository.findByCriteria(criteria);
  }
}
