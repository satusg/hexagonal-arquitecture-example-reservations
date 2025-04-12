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

    await useCase.execute({ type: "ONLINE", dateFrom: mockedReservation.getDate().toISOString(), dateTo: mockedReservation.getDate().toISOString()});
    
    const expectedCriteria = new ReservationCriteria(undefined, mockedReservation.getType(), mockedReservation.getDate(),mockedReservation.getDate());
    expect(repository.findByCriteria).toHaveBeenCalledWith(
        expectedCriteria
    );
    
  });
  
  it("Should retrieve by type and uuid combined", async () => {
    const uuid = reservations[1].getId().toString();
    const type = reservations[1].getType().toString();
    await useCase.execute({ type, uuid });
    const criteria = new ReservationCriteria(reservations[1].getId(), reservations[1].getType(), undefined, undefined)
    expect(repository.findByCriteria).toBeCalledWith(criteria);
    expect(repository.findByCriteria).toBeCalledTimes(1);    
  });
  
  it("Should retrieve reservations filtered by type", async () => {
    const mockedReservation = reservations[0];
    await useCase.execute({ type: mockedReservation.getType().toString()});
    const expectedCriteria = new ReservationCriteria(undefined, mockedReservation.getType(), undefined, undefined);
    expect(repository.findByCriteria).toHaveBeenCalledWith(expectedCriteria);
    expect(repository.findByCriteria).toHaveBeenCalledTimes(1);
  });

  it("Should retrieve reservations by uuid", async () => {
    const uuid = reservations[0].getId().toString();
    repository.findByCriteria.mockResolvedValue([reservations[0]]);
    const expectedCriteria = new ReservationCriteria(reservations[0].getId(), undefined, undefined, undefined);
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
      useCase.execute({ dateFrom: "invalid-date" })
    ).rejects.toThrow("Invalid date has been provided");
  });

  it("should throw if dateTo is invalid", async () => {
    await expect(async () =>
      useCase.execute({ dateTo: "bad-date-format" })
    ).rejects.toThrow("Invalid date has been provided");
  });

});
