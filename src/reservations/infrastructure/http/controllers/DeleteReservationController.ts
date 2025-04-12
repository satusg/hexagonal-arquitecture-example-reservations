import { Request, Response } from "express";
import DeleteReservationUseCase from "../../../application/DeleteReservationUseCase";

export default class DeleteReservationController {
    constructor(private readonly useCase: DeleteReservationUseCase) { }
    async run(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;
            const dto = {
                uuid: id
            };
            await this.useCase.execute(dto);
            res.status(204);
        } catch (error: any) {
            res.status(400).json({ message: error ? error.message : 'Unexpected error' });
        }
    }

}