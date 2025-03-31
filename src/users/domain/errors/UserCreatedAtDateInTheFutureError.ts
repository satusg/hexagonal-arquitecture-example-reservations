export class UserCreatedAtDateInTheFutureError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserCreatedAtDateInTheFutureError";
    }
}
