import { Request, Response } from "express";
import RetrieveReservationsByCriteriaUseCase from "../../application/RetriveReservationUseCase";
import DeleteReservationUseCase from "../../application/DeleteReservationUseCase";
import CreateReservationUseCase from "../../application/CreateReservationUseCase";
import { CreateReservationDTO } from "../../application/dto/CreateReservationDTO";
import { DeleteReservationDTO } from "../../application/dto/DeleteReservationDTO";
import { RetrieveReservationDTO } from "../../application/dto/RetrieveReservationDTO";
import UpdateReservationsUseCase from "../../application/UpdateReservationUseCase";
import { UpdateReservationDTO } from "../../application/dto/UpdateReservationDTO";


export default class ReservationController {
  constructor(
    private readonly createReservation: CreateReservationUseCase,
    private readonly retrieveReservations: RetrieveReservationsByCriteriaUseCase,
    private readonly deleteReservation: DeleteReservationUseCase,
    private readonly updateReservation: UpdateReservationsUseCase
  ) {}
  
  async updateReservationHandler(req: Request, res: Response): Promise<void> {

    try {
      const dto: UpdateReservationDTO = req.body;
      await this.updateReservation.execute(dto);
      res.status(204).end();
    } catch (error: any) {
      res.status(400).json({ message: (error.message || "Unexpected error") });
    }
  }

  async createReservationHandler(req: Request, res: Response): Promise<void> {

    try {
      const dto: CreateReservationDTO = req.body;
      //console.log(dto);
      await this.createReservation.execute(dto);
      res.status(204).end();
    } catch (error: any) {
      res.status(400).json({ message: (error.message || "Unexpected error") });
    }
  }

  async getReservationsHandler(req: Request, res: Response): Promise<void> {
    try {
      const dto: RetrieveReservationDTO = {
        uuid: req.query.uuid?.toString(),
        type: req.query.type?.toString(),
        date: {
          from: req.query.dateFrom?.toString(),
          to: req.query.dateTo?.toString()
        }
      };
      const reservations = await this.retrieveReservations.execute(dto);
      res.status(200).json(reservations.map((r: { toPrimitives: () => any; }) => r.toPrimitives()));
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Unexpected error" });
    }
  }

  async deleteReservationHandler(req: Request, res: Response): Promise<void> {
    try {
      const dto: DeleteReservationDTO = {
        uuid: req.params.uuid,
      };

      await this.deleteReservation.execute(dto);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Unexpected error" });
    }
  }
}
