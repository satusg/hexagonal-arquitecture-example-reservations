import DeleteReservationUseCase from "../../../src/reservations/application/DeleteReservationUseCase";
import Reservation from "../../../src/reservations/domain/Reservation";
import ReservationRepositoryLocal from "../../../src/reservations/infrastructure/repository/ReservationRepositoryLocal";
import ReservationFactory from "../domain/ReservationFactory";

jest.mock("../../../src/reservations/infrastructure/repository/ReservationRepositoryLocal");

describe("DeleteReservationUseCase", () => {
  let repository: jest.Mocked<ReservationRepositoryLocal>;
  let useCase: DeleteReservationUseCase;
  let mockedReservations: Reservation[];

  beforeAll(() => {
    repository = new ReservationRepositoryLocal() as jest.Mocked<ReservationRepositoryLocal>;
    useCase = new DeleteReservationUseCase(repository);
  });

  beforeEach(() => {
    mockedReservations = ReservationFactory.generateMany(3);
    repository.delete.mockClear(); // Limpia el mock para cada test
  });

  it("should delete an existing reservation", async () => {
    const uuid = mockedReservations[0].getId();
    repository.delete.mockResolvedValueOnce(); // define que no falle

    await useCase.execute({ uuid: uuid.toString() });

    expect(repository.delete).toHaveBeenCalledWith(uuid);
    expect(repository.delete).toHaveBeenCalledTimes(1);
  });

  it("should throw if the UUID is invalid", async () => {
    await expect(async () =>
      await useCase.execute({ uuid: "invalid-uuid" })
    ).rejects.toThrow("The provided UUID is not valid");
  });
});
