import express, { Request, Response, NextFunction } from "express";
import reservationsRouter from "./reservations/infrastructure/http/routes/ReservationRouter";
import ReservationRepositoryLocal from "./reservations/infrastructure/repository/ReservationRepositoryLocal";

const app = express();

app.use(express.json());

const repository = new ReservationRepositoryLocal();
app.use("/reservations", reservationsRouter(repository));

app.get("/", (_req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>🧩 Reservation API</title>
    </head>
    <body>
      <h1>🧩 Reservation API running (Hexagonal + DDD)</h1>

      <button onclick="testGet()">GET Reservations</button>
      <button onclick="testPost()">POST Reservation</button>
      <button onclick="testUpdate()">UPDATE Reservation</button>
      <button onclick="testDelete()">DELETE Reservation</button>

      <pre id="output" style="white-space: pre-wrap; margin-top: 20px;"></pre>

      <script>
        const baseUrl = "/reservations";
        const staticUuid = "01962a5e-75aa-7db1-a102-89ea4b7ce8c9";

        function show(output) {
          document.getElementById("output").textContent = typeof output === "string" ? output : JSON.stringify(output, null, 2);
        }

        function testGet() {
          fetch(baseUrl)
            .then(res => res.json())
            .then(data => show(data))
            .catch(err => show(err));
        }

        function testPost() {
          const body = {
            uuid: staticUuid,
            customer: {
              name: "Sato",
              email: "sato@example.com"
            },
            date: "2026-01-01T10:00:00.000Z",
            type: "ONLINE"
          };

          fetch(baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          })
            .then(res => res.status === 204 ? show("✅ Created") : res.json().then(show))
            .catch(err => show(err));
        }

        function testUpdate() {
          const updatedBody = {
            uuid: staticUuid,
            customer: {
              name: "Updated Sato",
              email: "sato@example.com"
            },
            date: "2026-01-01T10:00:00.000Z",
            type: "ONLINE"
          };

          fetch(baseUrl, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedBody)
          })
            .then(res => res.status === 204 ? show("✅ Updated") : res.json().then(show))
            .catch(err => show(err));
        }

        function testDelete() {
          fetch(\`\${baseUrl}/\${staticUuid}\`, {
            method: "DELETE"
          })
            .then(res => res.status === 204 ? show("✅ Deleted") : res.json().then(show))
            .catch(err => show(err));
        }
      </script>
    </body>
    </html>
  `);
});



app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("[ERROR]", err.stack);
  res.status(500).json({ message: err.message || "Unexpected error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
