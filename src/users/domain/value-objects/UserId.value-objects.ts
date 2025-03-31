import { uuidv7 } from 'uuidv7';  // Import the UUID v7 library
import { UserIdMissingValueError } from '../errors/UserIdMissingValueError';
import { UserIdNotValidError } from '../errors/UserIdNotValidError';

export class UserId {
    public constructor(private readonly value: string) {
        this.validate();
    }

    public toString(): string {
        return this.value;
    }

    public static generate(): UserId {
        const id = uuidv7(); 
        return new UserId(id);  
    }

    public static create(value: string): UserId {
        const userId = new UserId(value);
        return userId;
    }

    private validate(): void {
        if (!this.value) {
            throw new UserIdMissingValueError("The User ID value must be provided.");
        }

        if (!this.isValidUUIDv7(this.value)) {
            throw new UserIdNotValidError(`The User ID ${this.value} value must be a valid UUID v7.`);
        }
    }

    private isValidUUIDv7(value: string): boolean {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
    }
}
