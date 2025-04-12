import express from "express";
import reservationsRouter from "./reservations/infrastructure/http/routes/ReservationRouter";

const app = express();

app.use(express.json());
app.use("/reservations", reservationsRouter);

export default app;
