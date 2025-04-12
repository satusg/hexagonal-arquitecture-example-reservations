import ReservationRepository from "../domain/adapters/ReservationRepository";
import ReservationUUID from "../domain/value-objects/ReservationUUID";
import { DeleteReservationDTO } from "./dto/DeleteReservationDTO";

export default class DeleteReservationUseCase {
    constructor(private readonly repository: ReservationRepository) { }

    async execute(input: DeleteReservationDTO): Promise<void> {
        const uuid = ReservationUUID.fromString(input.uuid);
        await this.repository.delete(uuid);
    }
}
