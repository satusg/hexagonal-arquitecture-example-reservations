import { Request, Response } from "express";
import CreateReservationUseCase from "../../../application/CreateReservationUseCase";

export default class CreateReservationController {
    constructor(private readonly useCase: CreateReservationUseCase){

    }
    async run(req: Request, res: Response): Promise<void> {
        try {
            const {uuid, customerEmail, customerName, date, type} = req.body;
          const dto = {
            customerName: customerName,
            customerEmail: customerEmail,
            date: date,
            type: type,
            uuid: uuid
          };    
          await this.useCase.execute(dto);
          res.status(204);
        } catch (error: any) {
          res.status(400).json({ message: error ? error.message: 'Unexpected error' });
        }
      }
}