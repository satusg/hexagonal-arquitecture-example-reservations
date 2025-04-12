import express, { Express } from "express";
import request from "supertest";

import buildReservationRouter from "../../../../src/reservations/infrastructure/http/routes/ReservationRouter";
import ReservationRepositoryLocal from "../../../../src/reservations/infrastructure/repository/ReservationRepositoryLocal";
import { ReservationPrimitives } from "../../../../src/reservations/domain/Reservation";
import { faker } from "@faker-js/faker";
import ReservationUUID from "../../../../src/reservations/domain/value-objects/ReservationUUID";
import ReservationCriteria from "../../../../src/reservations/domain/criterea/ReservationCriteria";
import ReservationMother from "../../domain/ReservationMother";

describe("[Integration] POST /reservations", () => {
  let app: Express;
  let repository: ReservationRepositoryLocal;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    repository = new ReservationRepositoryLocal();
    app.use("/reservations", buildReservationRouter(repository));
  });

  it("should create a new reservation", async () => {
    const body: ReservationPrimitives = {
      uuid: ReservationUUID.generate().toString(),
      customerName: faker.person.firstName(),
      customerEmail: faker.internet.email(),
      date: new Date().toISOString(),
      type: "ONLINE"
    };
    const res = await request(app).post("/reservations").send(body);
    expect(res.status).toBe(204);
    expect(res.body).toStrictEqual({}); 
    const result = await repository.findByCriteria(new ReservationCriteria());
    expect(result).toHaveLength(1);
  });

  it("should return 400 if email is invalid", async () => {
    const body = {
      customerName: "John",
      customerEmail: "invalid-email",
      date: new Date().toISOString(),
      type: "ONLINE"
    };

    const res = await request(app).post("/reservations").send(body);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/email format is not valid/i);
  });

  it("should return 400 if type is invalid", async () => {
    const body = {
      customerName: "John",
      customerEmail: "john@example.com",
      date: new Date().toISOString(),
      type: "INVALID_TYPE"
    };

    const res = await request(app).post("/reservations").send(body);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Invalid ReservationType/i);
  });


  it("Should create and find the created reservation", async() => {
    const reservationBody = ReservationMother.createPrimitivesWith()
    const createBefore = await request(app).post("/reservations").send(reservationBody);
    expect(createBefore.status).toBe(204);
    const found = await request(app).get("/reservations");
    expect(found.body).toHaveLength(1);
    expect(found.body).toStrictEqual([reservationBody]);
  })
});
