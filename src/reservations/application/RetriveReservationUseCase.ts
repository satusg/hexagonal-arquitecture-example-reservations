import ReservationRepository from "../domain/adapters/ReservationRepository";
import ReservationCriteria from "../domain/criterea/ReservationCriteria";
import Reservation from "../domain/Reservation";
import { RetrieveReservationDTO } from "./dto/RetrieveReservationDTO";



export default class RetrieveReservationsByCriteriaUseCase {
  constructor(private readonly repository: ReservationRepository) {}

  async execute(input: RetrieveReservationDTO): Promise<Reservation[]> {
    const criteria = ReservationCriteria.createFromPrimitives({
      uuid: input.uuid?.trim(),
      type: input.type?.trim(),
      date: input.date && (input.date.from || input.date.to) ? {
        from: input.date.from ? input.date.from : undefined,
        to: input.date.to ? input.date.to : undefined
      } : undefined,
      customer: input.customer && (input.customer.email || input.customer.name) ? {
        email: input.customer.email ? input.customer.email : undefined,
        name: input.customer.name ? input.customer.name : undefined
      } : undefined
    });


    return await this.repository.findByCriteria(criteria);
  }
}
