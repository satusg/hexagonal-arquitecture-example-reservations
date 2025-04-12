import { Request, Response } from "express";
import RetrieveReservationsByCriteriaUseCase from "../../../application/RetriveReservationUseCase";

export default class RetrieveReservationsController {
  constructor(private readonly useCase: RetrieveReservationsByCriteriaUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const { uuid, type, dateFrom, dateTo } = req.query;

      const dto = {
        uuid: uuid?.toString(),
        type: type?.toString(),
        dateFrom: dateFrom?.toString(),
        dateTo: dateTo?.toString(),
      };
      
      const reservations = await this.useCase.execute(dto);
      res.status(200).json(reservations.map(r => r.toPrimitives()));
    } catch (error: any) {
      res.status(400).json({ message: error?.message ?? "Unexpected error" });
    }
  }
}
