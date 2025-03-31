export class UserIdNotValidError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserIdNotValidError";
    }
}
