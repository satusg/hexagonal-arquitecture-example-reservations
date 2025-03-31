
export class UserEmailEmptyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserEmailEmptyError";
    }
}
