
export class UserNameEmptyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserNameMissingValueError";
    }
}
