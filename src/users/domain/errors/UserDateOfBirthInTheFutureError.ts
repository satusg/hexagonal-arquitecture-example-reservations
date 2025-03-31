
export class UserDateOfBirthInTheFutureError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserDateOfBirthInTheFutureError";
    }
}
