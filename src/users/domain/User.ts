import { UserId } from "./value-objects/UserId.value-objects";
import { UserName } from "./value-objects/UserName.value-objects";
import { UserSurname } from "./value-objects/UserSurname.value-objects";
import { UserEmail } from "./value-objects/UserEmail.value-objects";
import { UserDateOfBirth } from "./value-objects/UserDateOfBirth.value-objects";
import { UserCreatedAtDate } from "./value-objects/UserCreatedAtDate.value-objects";
import { UserUpdatedAtDate } from "./value-objects/UserUpdatedAtDate.value-objects";

export class User {
    public constructor(
        public readonly id: UserId,
        public readonly name: UserName,
        public readonly surname: UserSurname,
        public readonly email: UserEmail,
        public readonly dateOfBirth: UserDateOfBirth,
        public readonly createdAt: UserCreatedAtDate,
        public readonly updatedAt: UserUpdatedAtDate,
    ) {}

    public getEmail(): UserEmail {
        return this.email;
    }

    public getFullName(): string {
        return `${this.name.toString()} ${this.surname.toString()}`;
    }

    public getCreatedAt(): string {
        return this.createdAt.toString();
    }

    public getUpdatedAt(): string {
        return this.updatedAt.toString();
    }

    public isAdult(): boolean {
        return this.dateOfBirth.getAge() >= 18;
    }
}
