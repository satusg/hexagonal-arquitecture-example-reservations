import { UpdateReservationDTO } from "../../../src/reservations/application/dto/UpdateReservationDTO";
import UpdateReservationsUseCase from "../../../src/reservations/application/UpdateReservationUseCase";
import ReservationRepositoryLocal from "../../../src/reservations/infrastructure/repository/ReservationRepositoryLocal";
import ReservationMother from "../domain/ReservationMother";

jest.mock("../../../src/reservations/infrastructure/repository/ReservationRepositoryLocal");

describe("UpdateReservationsUseCase", () => {
  let reservationsRepository: jest.Mocked<ReservationRepositoryLocal>;
  let useCase: UpdateReservationsUseCase;
  const mockByUUID = (dto: UpdateReservationDTO) => {
    const reservation = ReservationMother.createWith({
      uuid: dto.uuid
    });
    reservationsRepository.findByCriteria.mockImplementationOnce(async () => {
      return [reservation];
    });
  }

  beforeEach(() => {
    reservationsRepository = new ReservationRepositoryLocal as jest.Mocked<ReservationRepositoryLocal>;
    reservationsRepository.save.mockImplementation(jest.fn());
    useCase = new UpdateReservationsUseCase(reservationsRepository);
  });

  it("should update an existing reservation", async () => {
    let dto = ReservationMother.createPrimitivesWith();
    const reservation = ReservationMother.createWith(dto);
    reservationsRepository.findByCriteria.mockImplementation(async () => {
      return [reservation];
    });
    await useCase.execute(dto);
    expect(reservationsRepository.save).toHaveBeenCalledWith(reservation);
    expect(reservationsRepository.save).toHaveBeenCalledTimes(1);
  });

  it("should throw if name is invalid", async () => {
    const dto = ReservationMother.createPrimitivesWith({
      customer: {
        name: "",
        email: "test@test.com"
      }
    });
    mockByUUID(dto);
    await expect(() => useCase.execute(dto))
      .rejects.toThrow("The name should be at least one character long");
  });

  it("should throw if email is empty", async () => {
    const dto = ReservationMother.createPrimitivesWith({
      customer: {
        email: "",
        name: "Jhon"
      }
    });
    mockByUUID(dto);
    await expect(() => useCase.execute(dto))
      .rejects.toThrow("No email has been provided.");
  });

  it("should throw if email is invalid", async () => {
    const dto = ReservationMother.createPrimitivesWith({
      customer: {
        email: "invalid",
        name: "Jhon"
      }
    });
    mockByUUID(dto);
    await expect(() => useCase.execute(dto))
      .rejects.toThrow("The email format is not valid.");
  });

  it("should throw if date is invalid", async () => {
    const dto = ReservationMother.createPrimitivesWith({ date: "" });
    mockByUUID(dto);
    await expect(() => useCase.execute(dto))
      .rejects.toThrow("Invalid date");
  });

  it("should throw if type is invalid", async () => {
    const dto = ReservationMother.createPrimitivesWith({ type: "FAKE_TYPE" });
    mockByUUID(dto);
    await expect(() => useCase.execute(dto))
      .rejects.toThrow("Invalid ReservationType: FAKE_TYPE");
  });
  it("should throw if changing email and is already used", async () => {
    const duplicatedEmail = 'duplicated@test.com';
    const dto = ReservationMother.createPrimitivesWith(
      {
        customer: {
          email: duplicatedEmail,
          name: 'Duplicated User'
        }
      }
    );
    mockByUUID(dto);

    const findDuplicated = ReservationMother.createWith({
      customer: {
        email: duplicatedEmail,
        name: 'Duplicated User'
      }
    });
    reservationsRepository.findByCriteria.mockImplementationOnce(async () => {
      return [findDuplicated];
    });
    await expect(() => useCase.execute(dto))
      .rejects.toThrow("Email already in use");
  })
});
