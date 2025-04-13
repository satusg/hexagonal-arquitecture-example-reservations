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
      customer: {
          name: faker.person.firstName(),
          email: faker.internet.email()
      },
      date: new Date().toISOString(),
      type: "ONLINE"
    };
    const res = await request(app).post("/reservations").send(body);
    
    expect(res.status).toBe(204);
    expect(res.body).toStrictEqual({}); 
    const result = await repository.findByCriteria(ReservationCriteria.create());
    expect(result).toHaveLength(1);
  });

  it("should return 400 if email is invalid", async () => {
    const body = ReservationMother.createPrimitivesWith({
      customer: {
        email: 'invalid-email',
        name: 'Jhon'
      }
    })
    const res = await request(app).post("/reservations").send(body);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/email format is not valid/i);
  });

  it("should return 400 if type is invalid", async () => {
    const body = ReservationMother.createPrimitivesWith({
      type: 'INVALID-TYPE'
    })

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

  it("should return 400 if customer name is empty", async () => {
    const body = ReservationMother.createPrimitivesWith({
      customer: {
        email: "test@test.com",
        name: ""
      }
    })
  
    const res = await request(app).post("/reservations").send(body);
  
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/name should be at least one character/i);
  });

  
  it("should return 400 if date is invalid", async () => {
    const body = ReservationMother.createPrimitivesWith({
      date: 'invalid-date'
    });
  
    const res = await request(app).post("/reservations").send(body);
  
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid date/i);
  });

  it("should return 400 if uuid is invalid", async () => {
    const body = ReservationMother.createPrimitivesWith({
      uuid: 'uuid-invalid'
    })
    const res = await request(app).post("/reservations").send(body);
  
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/uuid is not valid/i);
  });
  
  it("should return 400 if UUID already exists", async () => {
    const reservation = ReservationMother.createPrimitivesWith();
    await request(app).post("/reservations").send(reservation);
    
    const duplicate = await request(app).post("/reservations").send(reservation);
  
    expect(duplicate.status).toBe(400);
    expect(duplicate.body.message).toMatch(/already exists/i);
  });
  
  it("should return 400 if required fields are missing", async () => {
    const res = await request(app).post("/reservations").send({});
  
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });
  
});
