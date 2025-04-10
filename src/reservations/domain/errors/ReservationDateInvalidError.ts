export default class ReservationDateInvalidError extends Error {
    constructor(message: string){
        super(message);
    }
}