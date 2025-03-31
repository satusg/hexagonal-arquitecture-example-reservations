
export class UserUpdatedAtDateInTheFutureError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserUpdatedAtDateInTheFutureError";
    }
}
