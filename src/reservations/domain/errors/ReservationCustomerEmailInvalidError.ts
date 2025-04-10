export default class ReservationCustomerEmailInvalidError extends Error{
    constructor(message: string){
        super(message);
    }
}