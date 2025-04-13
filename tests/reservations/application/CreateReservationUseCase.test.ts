import CreateReservationUseCase from "../../../src/reservations/application/CreateReservationUseCase";
import Reservation from "../../../src/reservations/domain/Reservation";
import ReservationRepositoryLocal from "../../../src/reservations/infrastructure/repository/ReservationRepositoryLocal";
import ReservationMother from "../domain/ReservationMother";

jest.mock("../../../src/reservations/infrastructure/repository/ReservationRepositoryLocal");

describe("CreateReservationUseCase", () => {
  let reservationsRepository: jest.Mocked<ReservationRepositoryLocal>;
  let createReservationUseCase: CreateReservationUseCase;

  beforeEach(() => {
    reservationsRepository = new ReservationRepositoryLocal as jest.Mocked<ReservationRepositoryLocal>;
    reservationsRepository.save.mockImplementation(jest.fn());
    createReservationUseCase = new CreateReservationUseCase(reservationsRepository);
  });

  it("should create a new reservation", async () => {
    const dto = ReservationMother.createPrimitivesWith();
    reservationsRepository.findByCriteria.mockImplementation(async () => {
      return [];
    });
    await createReservationUseCase.execute(dto);

    expect(reservationsRepository.save).toHaveBeenCalledWith(Reservation.fromPrimitives({
      uuid: dto.uuid,
      customer: {
        name: dto.customer.name,
        email: dto.customer.email,
      },
      type: dto.type,
      date: dto.date
    }));
    expect(reservationsRepository.save).toHaveBeenCalledTimes(1);
  });

  it("should throw if name is invalid", async () => {
    const dto = ReservationMother.createPrimitivesWith({
      customer: {
        name: "",
        email: "test@test.com"
      }
    });

    await expect(() => createReservationUseCase.execute(dto))
      .rejects.toThrow("The name should be at least one character long");
  });

  it("should throw if email is empty", async () => {
    await expect(() => createReservationUseCase.execute(ReservationMother.createPrimitivesWith({
      customer: {
        email: "",
        name: "Jhon"
      }
    })))
      .rejects.toThrow("No email has been provided.");
  });

  it("should throw if email is invalid", async () => {
    const dto = ReservationMother.createPrimitivesWith({
      customer: {
        email: "invalid",
        name: "Jhon"
      }
    });

    await expect(() => createReservationUseCase.execute(dto))
      .rejects.toThrow("The email format is not valid.");
  });

  it("should throw if date is invalid", async () => {
    const dto = ReservationMother.createPrimitivesWith({ date: "" });

    await expect(() => createReservationUseCase.execute(dto))
      .rejects.toThrow("Invalid date");
  });

  it("should throw if type is invalid", async () => {
    const dto = ReservationMother.createPrimitivesWith({ type: "FAKE_TYPE" });

    await expect(() => createReservationUseCase.execute(dto))
      .rejects.toThrow("Invalid ReservationType: FAKE_TYPE");
  });
});
