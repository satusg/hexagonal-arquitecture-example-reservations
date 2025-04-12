import { Router } from "express";
import CreateReservationUseCase from "../../../application/CreateReservationUseCase";
import DeleteReservationUseCase from "../../../application/DeleteReservationUseCase";
import RetrieveReservationsByCriteriaUseCase from "../../../application/RetriveReservationUseCase";
import ReservationController from "../ReservationController";
import ReservationRepository from "../../../domain/adapters/ReservationRepository";

export default function buildReservationRouter(repository: ReservationRepository): Router {
  const router = Router();

  const controller = new ReservationController(
    new CreateReservationUseCase(repository),
    new RetrieveReservationsByCriteriaUseCase(repository),
    new DeleteReservationUseCase(repository)
  );

  router.post("/", controller.createReservationHandler.bind(controller));
  router.get("/", controller.getReservationsHandler.bind(controller));
  router.delete("/:uuid", controller.deleteReservationHandler.bind(controller));

  return router;
}
