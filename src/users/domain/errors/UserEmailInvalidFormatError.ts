
export class UserEmailInvalidFormatError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserEmailInvalidFormatError";
    }
}
