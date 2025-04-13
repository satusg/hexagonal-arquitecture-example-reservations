import RetrieveReservationsByCriteriaUseCase from "../../../src/reservations/application/RetriveReservationUseCase";
import ReservationCriteria from "../../../src/reservations/domain/criterea/ReservationCriteria";
import Reservation from "../../../src/reservations/domain/Reservation";
import ReservationRepositoryLocal from "../../../src/reservations/infrastructure/repository/ReservationRepositoryLocal";
import ReservationFactory from "../domain/ReservationFactory";

jest.mock("../../../src/reservations/infrastructure/repository/ReservationRepositoryLocal");

describe("RetrieveReservationsByCriteriaUseCase", () => {
  let repository: jest.Mocked<ReservationRepositoryLocal>;

  let reservations: Reservation[];
  let useCase: RetrieveReservationsByCriteriaUseCase;

  beforeEach(() => {
    repository = new ReservationRepositoryLocal() as jest.Mocked<ReservationRepositoryLocal>;

    reservations = ReservationFactory.generateMany(3, {
      type: "ONLINE"
    });

    repository.findByCriteria.mockResolvedValue(reservations);
    useCase = new RetrieveReservationsByCriteriaUseCase(repository);
  });

  it("Should parse and pass date range criteria", async () => {
    const mockedReservation = reservations[0];

    await useCase.execute({
      type: "ONLINE", date: {
        from: mockedReservation.getDate().toISOString(),
        to: mockedReservation.getDate().toISOString()
      }
    });

    const expectedCriteria = ReservationCriteria.create({
      type: mockedReservation.getType(),
      date: {
        from: mockedReservation.getDate(),
        to: mockedReservation.getDate()
      }
    });
    expect(repository.findByCriteria).toHaveBeenCalledWith(
      expectedCriteria
    );

  });

  it("Should retrieve by type and uuid combined", async () => {
    const uuid = reservations[1].getId().toString();
    const type = reservations[1].getType().toString();
    await useCase.execute({ type, uuid });
    const criteria = ReservationCriteria.create({
      uuid: reservations[1].getId(),
      type: reservations[1].getType()
    })
    expect(repository.findByCriteria).toBeCalledWith(criteria);
    expect(repository.findByCriteria).toBeCalledTimes(1);
  });

  it("Should retrieve reservations filtered by type", async () => {
    const mockedReservation = reservations[0];
    await useCase.execute({ type: mockedReservation.getType().toString() });
    const expectedCriteria = ReservationCriteria.create({ type: mockedReservation.getType() });
    expect(repository.findByCriteria).toHaveBeenCalledWith(expectedCriteria);
    expect(repository.findByCriteria).toHaveBeenCalledTimes(1);
  });

  it("Should retrieve reservations by uuid", async () => {
    const uuid = reservations[0].getId().toString();
    repository.findByCriteria.mockResolvedValue([reservations[0]]);
    const expectedCriteria = ReservationCriteria.create({
      uuid: reservations[0].getId()
    });
    const result = await useCase.execute({ uuid });
    expect(repository.findByCriteria).toHaveBeenCalledWith(expectedCriteria);
    expect(result).toHaveLength(1);
    expect(result[0].getId().toString()).toBe(uuid);
  });

  it("Should retrieve empty array if no results match", async () => {
    repository.findByCriteria.mockResolvedValue([]);
    const result = await useCase.execute({ type: "PHONE" });
    expect(result).toEqual([]);
  });

  it("should throw if uuid is invalid", async () => {
    await expect(async () =>
      useCase.execute({ uuid: "not-a-valid-uuid" })
    ).rejects.toThrow("The provided UUID is not valid");
  });

  it("should throw if dateFrom is invalid", async () => {
    await expect(async () =>
      useCase.execute({
        date: {
          from: "invalid-date"
        }
      })
    ).rejects.toThrow("Invalid date has been provided");
  });

  it("should throw if dateTo is invalid", async () => {
    await expect(async () =>
      useCase.execute({
        date: {
          to: "bad-date-format"
        }
      })
    ).rejects.toThrow("Invalid date has been provided");
  });

});
