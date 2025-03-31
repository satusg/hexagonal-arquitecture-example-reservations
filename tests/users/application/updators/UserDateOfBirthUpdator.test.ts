import { UserDateOfBirthUpdator } from "../../../../src/users/application/updators/UserDateOfBirthUpdator";
import { UserDateOfBirthInTheFutureError } from "../../../../src/users/domain/errors/UserDateOfBirthInTheFutureError";
import { UserDateOfBirthInvalidError } from "../../../../src/users/domain/errors/UserDateOfBirthInvalidError";
import { UserUnderageError } from "../../../../src/users/domain/errors/UserUnderageError";
import { User } from "../../../../src/users/domain/User";
import { UNDER_AGE_VALUE, UserDateOfBirth } from "../../../../src/users/domain/value-objects/UserDateOfBirth.value-objects";
import UserLocalStorageRepository from "../../../../src/users/infrastructure/UserLocalStorageRepository";
import { UserFactory } from "../../domain/UserFactory";
import { UserMother } from "../../domain/UserMother";
jest.mock("../../../../src/users/infrastructure/UserLocalStorageRepository");
describe('UserDateOfBirthupdator', () => {
    let mockUser: User;
    let userRepository: jest.Mocked<UserLocalStorageRepository>;
    let userDateOfBirthupdator: UserDateOfBirthUpdator;
    beforeEach(() => {
        mockUser = UserMother.createDefaultUser();
        userRepository = new UserLocalStorageRepository() as jest.Mocked<UserLocalStorageRepository>;
        userDateOfBirthupdator = new UserDateOfBirthUpdator(userRepository);
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.save = jest.fn().mockResolvedValue(undefined);
    });

    it('Should update the date of birth', async () => {
        const newUserDateOfBirth = UserFactory.getRandomUserDateOfBirth();
        const updatedUser = await userDateOfBirthupdator.execute(mockUser.id, newUserDateOfBirth);
        expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
        expect(updatedUser.dateOfBirth).toBe(newUserDateOfBirth);
    });

    it(`Should not update the date of birth if it hasn't been modified`, async () => {
        const sameUserDateOfBirth = mockUser.dateOfBirth;
        const updatedUser = await userDateOfBirthupdator.execute(mockUser.id, sameUserDateOfBirth);
        expect(userRepository.save).not.toBeCalled();
        expect(updatedUser.dateOfBirth).toBe(mockUser.dateOfBirth);
    });

    it(`should throw UserDateOfBirthInvalidError if the date of birth is invalid`, async () => {
        expect(() => { new UserDateOfBirth(new Date("")) }).toThrow(UserDateOfBirthInvalidError);
    });

    it(`should throw UserDateOfBirthInTheFutureError if the date of birth is invalid`, async () => {
        expect(() => { new UserDateOfBirth(new Date(new Date().setFullYear(new Date().getFullYear() + 1))) }).toThrow(UserDateOfBirthInTheFutureError);
    });

    it(`should throw UserUnderageError if the date of birth is under ${UNDER_AGE_VALUE}`, async () => {
        expect(() => { UserFactory.getRandomUserDateOfBirth(UNDER_AGE_VALUE - 1, UNDER_AGE_VALUE - 1) }).toThrow(UserUnderageError);
    });
})