import express, { Express } from "express";
import request from "supertest";

import buildReservationRouter from "../../../../src/reservations/infrastructure/http/routes/ReservationRouter";
import ReservationRepositoryLocal from "../../../../src/reservations/infrastructure/repository/ReservationRepositoryLocal";
import { ReservationPrimitives } from "../../../../src/reservations/domain/Reservation";
import ReservationMother from "../../domain/ReservationMother";

describe("[Integration] Reservation listing", () => {
  let app: Express;
  let repository: ReservationRepositoryLocal;

  const type = "ONLINE";

  const expectReservationMatch = (received: any, expected: ReservationPrimitives) => {
    expect(received).toMatchObject({
      uuid: expected.uuid,
      customerName: expected.customerName,
      customerEmail: expected.customerEmail,
      date: expected.date,
      type: expected.type,
    });
  };

  beforeEach(() => {
    app = express();
    app.use(express.json());

    repository = new ReservationRepositoryLocal();
    app.use("/reservations", buildReservationRouter(repository));
  });

  it("should return all reservations filtered by type", async () => {
    const reservations = Array.from({ length: 3 }, () =>
      ReservationMother.createPrimitivesWith({ type })
    );

    for (const r of reservations) {
      await request(app).post("/reservations").send(r);
    }

    const res = await request(app).get(`/reservations?type=${type}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
    res.body.forEach((r: any) => expect(r.type).toBe(type));
  });

  it("should return empty array if no reservations match the type", async () => {
    const res = await request(app).get("/reservations?type=IN_PERSON");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should create a new reservation and should be able to find it", async () => {
    const reservationBody = ReservationMother.createPrimitivesWith();

    const createRes = await request(app).post("/reservations").send(reservationBody);
    expect(createRes.status).toBe(204);

    const findBefore = await request(app).get(`/reservations?uuid=${reservationBody.uuid}`);
    expect(findBefore.status).toBe(200);
    expect(findBefore.body).toHaveLength(1);
    expectReservationMatch(findBefore.body[0], reservationBody);
  });

  it("should return reservation by uuid and type combined", async () => {
    const reservationBody = ReservationMother.createPrimitivesWith({ type: "ONLINE" });

    await request(app).post("/reservations").send(reservationBody);

    const res = await request(app).get(
      `/reservations?uuid=${reservationBody.uuid}&type=ONLINE`
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expectReservationMatch(res.body[0], reservationBody);
  });

  it("should return reservation by type and dateFrom", async () => {
    const reservationBody = ReservationMother.createPrimitivesWith({
      type: "ONLINE",
      date: "2026-01-01T10:00:00.000Z",
    });

    await request(app).post("/reservations").send(reservationBody);

    const res = await request(app).get(
      `/reservations?type=ONLINE&dateFrom=2026-01-01T00:00:00.000Z`
    );

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    const match = res.body.find((r: any) => r.uuid === reservationBody.uuid);
    expectReservationMatch(match, reservationBody);
  });

  it("should return reservation by type and full date range", async () => {
    const reservationBody = ReservationMother.createPrimitivesWith({
      type: "ONLINE",
      date: "2026-02-10T10:00:00.000Z",
    });

    await request(app).post("/reservations").send(reservationBody);

    const res = await request(app).get(
      `/reservations?type=ONLINE&dateFrom=2026-02-01T00:00:00.000Z&dateTo=2026-02-28T23:59:59.999Z`
    );

    expect(res.status).toBe(200);
    const match = res.body.find((r: any) => r.uuid === reservationBody.uuid);
    expect(match).toBeDefined();
    expectReservationMatch(match, reservationBody);
  });

  it("should return empty array when reservation is out of date range", async () => {
    const reservationBody = ReservationMother.createPrimitivesWith({
      type: "ONLINE",
      date: "2027-01-01T00:00:00.000Z",
    });

    await request(app).post("/reservations").send(reservationBody);

    const res = await request(app).get(
      `/reservations?dateFrom=2025-01-01T00:00:00.000Z&dateTo=2025-12-31T23:59:59.999Z`
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  it("should return empty array when type mismatches but date matches", async () => {
    const reservationBody = ReservationMother.createPrimitivesWith({
      type: "PHONE",
      date: "2026-05-01T12:00:00.000Z",
    });

    await request(app).post("/reservations").send(reservationBody);

    const res = await request(app).get(
      `/reservations?type=IN_PERSON&dateFrom=2026-01-01T00:00:00.000Z`
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  it("should return 400 if invalid dateFrom is provided", async () => {
    const res = await request(app).get(`/reservations?dateFrom=invalid-date`);
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("Invalid date");
  });

  it("should return 400 if invalid dateTo is provided", async () => {
    const res = await request(app).get(`/reservations?dateTo=invalid-date`);
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("Invalid date");
  });

  it("should return 400 if invalid type is provided", async () => {
    const res = await request(app).get(`/reservations?type=INVALID_TYPE`);
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("Invalid ReservationType");
  });

  it("should return 400 if invalid uuid is provided", async () => {
    const res = await request(app).get(`/reservations?uuid=123-invalid-uuid`);
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("The provided UUID is not valid");
  });
});
