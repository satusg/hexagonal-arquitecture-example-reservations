import express, { Request, Response, NextFunction } from "express";
import reservationsRouter from "./reservations/infrastructure/http/routes/ReservationRouter";

const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.use("/reservations", reservationsRouter);

// Ruta base opcional
app.get("/", (req: Request, res: Response) => {
  res.send("🧩 Reservation API running (Hexagonal + DDD)");
});

// Manejador de errores genérico
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("[ERROR]", err.stack);
  res.status(500).json({ message: err.message || "Unexpected error" });
});

// Arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
