import express, { Express } from "express";
import request from "supertest";

import buildReservationRouter from "../../../../src/reservations/infrastructure/http/routes/ReservationRouter";
import ReservationRepositoryLocal from "../../../../src/reservations/infrastructure/repository/ReservationRepositoryLocal";
import ReservationUUID from "../../../../src/reservations/domain/value-objects/ReservationUUID";
import ReservationMother from "../../domain/ReservationMother";
import { ReservationPrimitives } from "../../../../src/reservations/domain/Reservation";

describe("[Integration] Reservation deletion flow", () => {
  let app: Express;
  let repository: ReservationRepositoryLocal;

  const expectReservationMatch = (received: any, expected: ReservationPrimitives) => {
    expect(received).toMatchObject({
      uuid: expected.uuid,
      customer: {
        name: expected.customer.name,
        email: expected.customer.email
      },
      type: expected.type,
    });
  };

  beforeEach(async () => {
    app = express();
    app.use(express.json());

    repository = new ReservationRepositoryLocal();
    app.use("/reservations", buildReservationRouter(repository));
  });

  it("should delete a created reservation", async () => {
    const reservationBody = ReservationMother.createPrimitivesWith();

    const createRes = await request(app).post("/reservations").send(reservationBody);

    expect(createRes.status).toBe(204);

    const findBefore = await request(app).get(`/reservations?uuid=${reservationBody.uuid}`);
    expect(findBefore.status).toBe(200);
    expect(findBefore.body).toHaveLength(1);
    expectReservationMatch(findBefore.body[0], reservationBody);

    const deleteRes = await request(app).delete(`/reservations/${reservationBody.uuid}`);
    expect(deleteRes.status).toBe(204);
    expect(deleteRes.body).toEqual({});

    const findAfter = await request(app).get(`/reservations?uuid=${reservationBody.uuid}`);
    expect(findAfter.status).toBe(200);
    expect(findAfter.body).toEqual([]);
  });

  it("should return 400 when uuid is invalid", async () => {
    const res = await request(app).delete("/reservations/invalid-uuid");
    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      message: "The provided UUID is not valid",
    });
  });

  it("should return 204 when uuid is valid but not found", async () => {
    const nonExistentUUID = ReservationUUID.generate();
    const res = await request(app).delete(`/reservations/${nonExistentUUID.toString()}`);
    expect(res.status).toBe(204);
    expect(res.body).toStrictEqual({});
  });
  
  it("should handle double deletion gracefully", async () => {
    const reservationBody = ReservationMother.createPrimitivesWith();
  
    await request(app).post("/reservations").send(reservationBody);
  
    const firstDelete = await request(app).delete(`/reservations/${reservationBody.uuid}`);
    expect(firstDelete.status).toBe(204);
  
    const secondDelete = await request(app).delete(`/reservations/${reservationBody.uuid}`);
    expect(secondDelete.status).toBe(204);
  
    const find = await request(app).get(`/reservations?uuid=${reservationBody.uuid}`);
    expect(find.body).toHaveLength(0);
  });

  it("should return 404 if delete route is accessed without UUID", async () => {
    const res = await request(app).delete("/reservations/");
    expect(res.status).toBe(404);
  });
  
  it("should return 400 if UUID is syntactically valid but not v7", async () => {
    const legacyUUID = "a8098c1a-f86e-11da-bd1a-00112444be1e"; // UUID v1
    const res = await request(app).delete(`/reservations/${legacyUUID}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("The provided UUID is not valid");
  });
  
});
