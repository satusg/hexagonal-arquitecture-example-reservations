import { UserUpdatedAtDateInTheFutureError } from "../errors/UserUpdatedAtDateInTheFutureError";
import { UserUpdatedAtDateInvalidError } from "../errors/UserUpdatedAtDateInvalidError";

export class UserUpdatedAtDate {
    constructor(private readonly  value: Date) {
        this.validate();
    }

    private validate(): void {
        if (isNaN(this.value.getTime())) {
            throw new UserUpdatedAtDateInvalidError("Invalid updatedAt date.");
        }
        const currentDate = new Date();
        if (this.value > currentDate) {
            throw new UserUpdatedAtDateInTheFutureError("updatedAt date cannot be in the future.");
        }
    }

    public toString(): string {
        return this.value.toISOString();
    }

    public toDate(): Date  {
        return this.value;
    }

    public static now(): UserUpdatedAtDate{
        return new UserUpdatedAtDate(new Date());
    }
}


