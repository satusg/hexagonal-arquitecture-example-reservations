import { UserFactory } from "./UserFactory";
import { User } from "../../../src/users/domain/User";
import { UserId } from "../../../src/users/domain/value-objects/UserId.value-objects";
import { UserName } from "../../../src/users/domain/value-objects/UserName.value-objects";
import { UserSurname } from "../../../src/users/domain/value-objects/UserSurname.value-objects";
import { UserEmail } from "../../../src/users/domain/value-objects/UserEmail.value-objects";
import { UserDateOfBirth } from "../../../src/users/domain/value-objects/UserDateOfBirth.value-objects";
import { UserCreatedAtDate } from "../../../src/users/domain/value-objects/UserCreatedAtDate.value-objects";
import { UserUpdatedAtDate } from "../../../src/users/domain/value-objects/UserUpdatedAtDate.value-objects";
import { UNDER_AGE_VALUE } from "../../../src/users/domain/value-objects/UserDateOfBirth.value-objects";

export class UserMother {
    private static generateRandomCreatedAtUpdatedAt(): {
        userCreatedAt: UserCreatedAtDate;
        userUpdatedAt: UserUpdatedAtDate;
    } {
        const userCreatedAt = UserFactory.getRandomUserCreatedAt();
        const userUpdatedAt = UserFactory.getRandomUserUpdatedAtFromUserCreatedAt(userCreatedAt);
        return { userCreatedAt, userUpdatedAt };
    }

    public static createDefaultUser(
        name: string = "John", 
        surname: string = "Doe", 
        email: string = "john.doe@example.com", 
        dateOfBirth: Date = new Date("1990-01-01"), 
        createdAt: Date = new Date("2020-01-01"), 
        updatedAt: Date = new Date("2021-01-01")
    ): User {
        return new User(
            new UserId("0195e7a3-eb25-7afb-b381-623a6e326b0b"),
            new UserName(name), 
            new UserSurname(surname), 
            new UserEmail(email), 
            new UserDateOfBirth(dateOfBirth), 
            new UserCreatedAtDate(createdAt),
            new UserUpdatedAtDate(updatedAt)
        );
    }

    public static createWithCustomName(name: string): User {
        const { userCreatedAt, userUpdatedAt } = this.generateRandomCreatedAtUpdatedAt();
        return new User(
            UserFactory.getRandomUserId(),
            new UserName(name),
            new UserSurname("Doe"),
            UserFactory.getRandomEmail(name, "Doe"),
            UserFactory.getRandomUserDateOfBirth(),
            userCreatedAt,
            userUpdatedAt
        );
    }

    public static createWithCustomSurname(surname: string): User {
        const { userCreatedAt, userUpdatedAt } = this.generateRandomCreatedAtUpdatedAt();
        return new User(
            UserFactory.getRandomUserId(),
            UserFactory.getRandomName(),
            new UserSurname(surname),
            UserFactory.getRandomEmail(),
            UserFactory.getRandomUserDateOfBirth(),
            userCreatedAt,
            userUpdatedAt
        );
    }

    public static createWithCustomEmail(email: string): User {
        const { userCreatedAt, userUpdatedAt } = this.generateRandomCreatedAtUpdatedAt();
        return new User(
            UserFactory.getRandomUserId(),
            UserFactory.getRandomName(),
            UserFactory.getRandomSurname(),
            new UserEmail(email),
            UserFactory.getRandomUserDateOfBirth(),
            userCreatedAt,
            userUpdatedAt
        );
    }

    public static createWithCustomDateOfBirth(dateOfBirth: Date): User {
        const { userCreatedAt, userUpdatedAt } = this.generateRandomCreatedAtUpdatedAt();
        return new User(
            UserFactory.getRandomUserId(),
            UserFactory.getRandomName(),
            UserFactory.getRandomSurname(),
            UserFactory.getRandomEmail(),
            new UserDateOfBirth(dateOfBirth),
            userCreatedAt,
            userUpdatedAt
        );
    }

    public static createRandomUser(): User {
        return UserFactory.createRandomUser();
    }

    public static createUserWithCustomAge(minAge: number = UNDER_AGE_VALUE, maxAge: number = 65): User {
        const { userCreatedAt, userUpdatedAt } = this.generateRandomCreatedAtUpdatedAt();
        return new User(
            UserFactory.getRandomUserId(),
            UserFactory.getRandomName(),
            UserFactory.getRandomSurname(),
            UserFactory.getRandomEmail(),
            UserFactory.getRandomUserDateOfBirth(minAge, maxAge),
            userCreatedAt,
            userUpdatedAt
        );
    }
}
