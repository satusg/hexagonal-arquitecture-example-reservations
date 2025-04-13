import { Request, Response } from "express";
import UpdateReservationsUseCase from "../../../application/UpdateReservationUseCase";
import { UpdateReservationDTO } from "../../../application/dto/UpdateReservationDTO";
export default class UpdateReservationController {
    constructor(private readonly useCase: UpdateReservationsUseCase) { }
    async run(req: Request, res: Response): Promise<void> {
        try {
            let body: UpdateReservationDTO = req.body;
            const dto = {
                customer: {
                    name: body.customer?.name?.trim(),
                    email: body.customer?.email?.trim()?.toLowerCase()
                },
                date: body.date?.trim(),
                type: body.type?.trim(),
                uuid: body.uuid?.trim()
            };
            await this.useCase.execute(dto);
            res.status(204).end();
        } catch (error: any) {
            res.status(400).json({ message: error?.message || 'Unexpected error' });
        }
    }
}
