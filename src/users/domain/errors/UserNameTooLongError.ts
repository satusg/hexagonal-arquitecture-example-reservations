
export class UserNameTooLongError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserNameTooLongError";
    }
}
