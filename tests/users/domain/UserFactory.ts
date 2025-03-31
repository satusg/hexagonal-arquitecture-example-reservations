import { faker } from '@faker-js/faker';
import { User } from '../../../src/users/domain/User';
import { UserSurname } from '../../../src/users/domain/value-objects/UserSurname.value-objects';
import { UserId } from '../../../src/users/domain/value-objects/UserId.value-objects';
import { UserName } from '../../../src/users/domain/value-objects/UserName.value-objects';
import { UserEmail } from '../../../src/users/domain/value-objects/UserEmail.value-objects';
import { uuidv7 } from 'uuidv7';
import { UserCreatedAtDate } from '../../../src/users/domain/value-objects/UserCreatedAtDate.value-objects';
import { UserUpdatedAtDate } from '../../../src/users/domain/value-objects/UserUpdatedAtDate.value-objects';
import { UNDER_AGE_VALUE, UserDateOfBirth } from '../../../src/users/domain/value-objects/UserDateOfBirth.value-objects';
export class UserFactory {
    public static getRandomUserCreatedAt(fromDate: string | number | Date = '2020-01-01T00:00:00.000Z', toDate: string | number | Date = '2022-12-31T23:59:59.999Z'): UserCreatedAtDate {
        return new UserCreatedAtDate(faker.date.between({ from: fromDate, to: toDate }));
    }
    public static getRandomUserUpdatedAtFromUserCreatedAt(createdAt: UserCreatedAtDate): UserUpdatedAtDate {
        return this.getRandomUserUpdatedAt(createdAt.toDate(), new Date());
    }
    public static getRandomUserUpdatedAt(fromDate: string | number | Date = '2020-01-01T00:00:00.000Z', toDate: string | number | Date = '2022-12-31T23:59:59.999Z'){
        return new UserUpdatedAtDate(faker.date.between({from: fromDate, to: toDate}));
    }
    public static getRandomUserDateOfBirth(ageFrom: number = UNDER_AGE_VALUE, ageTo: number = 65 ){
        return new UserDateOfBirth(faker.date.birthdate({ mode: 'age', min: ageFrom, max: ageTo }));
    }

    public static getRandomName(): UserName {
        return new UserName(faker.person.firstName());
    }
    public static getRandomSurname(): UserSurname {
        return new UserSurname(faker.person.lastName());
    }
    public static getRandomEmail(firstName?: string, lastName?: string){
        return new UserEmail(faker.internet.email({
            firstName: firstName,
            lastName: lastName
        }));
    }
    public static getRandomUserId(): UserId
    {
        return new UserId(uuidv7());
    }
    public static createRandomUser(): User {
        const userId = this.getRandomUserId();
        const userName = this.getRandomName();
        const userSurname = this.getRandomSurname();
        const userEmail = this.getRandomEmail();
        const userDateOfBirth = this.getRandomUserDateOfBirth();
        const userCreatedAtDate = this.getRandomUserCreatedAt();
        const userUpdatedAtDate = this.getRandomUserUpdatedAtFromUserCreatedAt(userCreatedAtDate);

        return new User(
            userId, // Generate a new UserId using uuidv7
            userName,
            userSurname,
            userEmail,
            userDateOfBirth,
            userCreatedAtDate,
            userUpdatedAtDate
        );
    }
}
