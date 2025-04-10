import { uuidv7 } from "uuidv7";
import Reservation from "../../../src/reservations/domain/Reservation";
import ReservationRepositoryLocal from "../../../src/reservations/infrastructure/ReservationRepositoryLocal"
import CreateReservationUseCase from "../../../src/reservations/application/CreateReservationUseCase";

jest.mock("../../../src/reservations/infrastructure/ReservationRepositoryLocal");
describe('CreateReservationUseCase', () => {
    let reservationsRepository: jest.Mocked<ReservationRepositoryLocal>;
    let mockReservation: Reservation;
    let createReservationUseCase: CreateReservationUseCase;
    beforeAll(() => {
        reservationsRepository = new ReservationRepositoryLocal as jest.Mocked<ReservationRepositoryLocal>;
        reservationsRepository.save.mockReturnValue = jest.fn();
        mockReservation = Reservation.fromPrimitives({
            uuid: uuidv7(),
            customerName: "Jhon Doe",
            customerEmail: "jhon.doe@email.com",
            date: "2025-06-10T10:00:00.000Z",
            type: "ONLINE"
        });
        reservationsRepository.delete.mockReturnValue = jest.fn();
        reservationsRepository.findByUUID.mockResolvedValue(mockReservation);
        reservationsRepository.findAll.mockResolvedValue([mockReservation]);
        createReservationUseCase = new CreateReservationUseCase(reservationsRepository);
    });
    it('Should create a new Reservation', async () => {
        const result = await createReservationUseCase.execute({
            customerName: 'Jhon Doe',
            customerEmail: 'jhon.doe@email.com',
            date: "2025-06-10T10:00:00.000Z",
            type: 'ONLINE'
        });
        expect(reservationsRepository.save).toHaveBeenCalledWith(result);
        expect(reservationsRepository.save).toHaveBeenCalledTimes(1);
        expect(result.getDate().toISOString()).toBe("2025-06-10T10:00:00.000Z");
        expect(result.getCustomer().getName().getValue()).toBe("Jhon Doe");
        expect(result.getCustomer().getEmail().getValue()).toBe("jhon.doe@email.com");
        expect(result.getType().toString()).toBe("ONLINE");
    });
    it("Should throw if email is invalid", async () => {
        await expect(() =>
            createReservationUseCase.execute({
                customerName: "Sr. Sato",
                customerEmail: "bademail",
                date: "2025-06-10T10:00:00.000Z",
                type: "ONLINE"
            })
        ).rejects.toThrow("The email format is not valid.");
    });
})