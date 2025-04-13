import ReservationRepository from "../domain/adapters/ReservationRepository";
import ReservationCriteria from "../domain/criterea/ReservationCriteria";
import ReservationCustomerEmailInvalidError from "../domain/errors/ReservationCustomerEmailInvalidError";
import ReservationNotFoundError from "../domain/errors/ReservationNotFoundError";
import Reservation from "../domain/Reservation";

import { UpdateReservationDTO } from "./dto/UpdateReservationDTO";

export default class UpdateReservationsUseCase {
  constructor(private readonly repository: ReservationRepository) {}

  async execute(input: UpdateReservationDTO): Promise<void> {
    const [existing] = await this.repository.findByCriteria(
      ReservationCriteria.createFromPrimitives({ uuid: input.uuid })
    );

    if (!existing) {
      throw new ReservationNotFoundError(
        "The reservation with the provided UUID was not found"
      );
    }

    const updated = Reservation.fromPrimitives({
      ...existing.toPrimitives(),
      ...input,
    });

    const isEmailChanged = !existing
      .getCustomer()
      .getEmail()
      .equals(updated.getCustomer().getEmail());

    if (isEmailChanged) {
      const duplicate = await this.repository.findByCriteria(
        ReservationCriteria.createFromPrimitives({
          customer: { email: updated.getCustomer().getEmail().toString() },
        })
      );

      if (duplicate.length > 0) {
        throw new ReservationCustomerEmailInvalidError("Email already in use");
      }
    }

    await this.repository.save(updated);
  }
}