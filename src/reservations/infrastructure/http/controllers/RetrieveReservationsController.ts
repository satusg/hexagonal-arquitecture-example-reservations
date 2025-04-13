import { Request, Response } from "express";
import RetrieveReservationsByCriteriaUseCase from "../../../application/RetriveReservationUseCase";
import { RetrieveReservationDTO } from "../../../application/dto/RetrieveReservationDTO";

export default class RetrieveReservationsController {
  constructor(private readonly useCase: RetrieveReservationsByCriteriaUseCase) { }

  async run(req: Request, res: Response): Promise<void> {
    console.log(req.query);
    try {
      const body: RetrieveReservationDTO = req.query;

      const dto: RetrieveReservationDTO = {
        uuid: body?.uuid?.toString(),
        type: body?.type?.toString(),
        date: {
          from: body?.date?.from?.toString()?.trim(),
          to: body?.date?.to?.toString()?.trim()
        },
        customer: {
          email: body?.customer?.email?.toString()?.trim(),
          name: body?.customer?.name?.toString()?.trim()
        }
      };
      console.log(dto);
      const reservations = await this.useCase.execute(dto);
      res.status(200).json(reservations.map(r => r.toPrimitives()));
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: error?.message ?? "Unexpected error" });
    }
  }
}
