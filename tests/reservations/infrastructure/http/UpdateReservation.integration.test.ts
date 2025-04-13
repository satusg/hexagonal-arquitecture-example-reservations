import express, { Express } from "express";
import request from "supertest";

import buildReservationRouter from "../../../../src/reservations/infrastructure/http/routes/ReservationRouter";
import ReservationRepositoryLocal from "../../../../src/reservations/infrastructure/repository/ReservationRepositoryLocal";
import ReservationMother from "../../domain/ReservationMother";
import { UpdateReservationDTO } from "../../../../src/reservations/application/dto/UpdateReservationDTO";

describe("[Integration] PATCH /reservations", () => {
  let app: Express;
  let repository: ReservationRepositoryLocal;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    repository = new ReservationRepositoryLocal();
    app.use("/reservations", buildReservationRouter(repository));
  });

  it("should update an existing reservation successfully", async () => {
    const original = ReservationMother.createPrimitivesWith();
    await request(app).post("/reservations").send(original).expect(204);

    const dto: UpdateReservationDTO = {
      uuid: original.uuid,
      customer: {
        name: "Updated Name",
        email: original.customer.email,
      },
      date: original.date,
      type: original.type,
    };

    const updateRes = await request(app).patch("/reservations").send(dto);
    expect(updateRes.status).toBe(204);

    const getRes = await request(app).get(`/reservations?uuid=${original.uuid}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body).toHaveLength(1);
    expect(getRes.body[0].customer.name).toBe("Updated Name");
  });

  it("should return 400 when updating non-existent reservation", async () => {
    const fake: UpdateReservationDTO = ReservationMother.createPrimitivesWith();
    const res = await request(app).patch("/reservations").send(fake);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("The reservation with the provided UUID was not found");
  });

  it("should return 400 when updated email is already used", async () => {
    const existing1 = ReservationMother.createPrimitivesWith();
    const existing2 = ReservationMother.createPrimitivesWith();

    await request(app).post("/reservations").send(existing1).expect(204);
    await request(app).post("/reservations").send(existing2).expect(204);

    const dto: UpdateReservationDTO = {
      uuid: existing1.uuid,
      customer: {
        name: "Duplicated",
        email: existing2.customer.email,
      },
      date: existing1.date,
      type: existing1.type,
    };

    const res = await request(app).patch("/reservations").send(dto);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email already in use");
  });

  it("should return 400 if uuid is invalid", async () => {
    const res = await request(app).patch("/reservations").send({
      uuid: "invalid-uuid",
      customer: {
        name: "John",
        email: "john@example.com",
      },
      date: new Date().toISOString(),
      type: "ONLINE",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("UUID");
  });
});
