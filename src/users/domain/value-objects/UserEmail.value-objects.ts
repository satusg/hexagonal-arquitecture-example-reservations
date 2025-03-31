import { UserEmailEmptyError } from "../errors/UserEmailEmptyError";
import { UserEmailInvalidFormatError } from "../errors/UserEmailInvalidFormatError";

export class UserEmail {
    public constructor(private readonly value: string) {
        this.validate();
    }

    private validate(): void {
        if (!this.value) {
            throw new UserEmailEmptyError("The User Email can't be empty");
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(this.value)) {
            throw new UserEmailInvalidFormatError("The User Email must be in a valid format");
        }
    }

    public toString(): string {
        return this.value;
    }
}


