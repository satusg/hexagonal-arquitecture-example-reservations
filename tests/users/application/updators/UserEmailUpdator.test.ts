import { UserEmailUpdator } from "../../../../src/users/application/updators/UserEmailUpdator";
import { UserEmailEmptyError } from "../../../../src/users/domain/errors/UserEmailEmptyError";
import { UserEmailInvalidFormatError } from "../../../../src/users/domain/errors/UserEmailInvalidFormatError";
import { UserRepository } from "../../../../src/users/domain/repositories/UserRepository";
import { User } from "../../../../src/users/domain/User";
import { UserEmail } from "../../../../src/users/domain/value-objects/UserEmail.value-objects";
import UserLocalStorageRepository from "../../../../src/users/infrastructure/UserLocalStorageRepository";
import { UserFactory } from "../../domain/UserFactory";
import { UserMother } from "../../domain/UserMother";  // Adjust the path to the location of UserMother

jest.mock("../../../../src/users/infrastructure/UserLocalStorageRepository");

describe("UserEmailUpdator", () => {
  let userRepository: jest.Mocked<UserRepository>;
  let userEmailUpdator: UserEmailUpdator;
  let mockUser: User;
  beforeEach(() => {
    userRepository = new UserLocalStorageRepository() as jest.Mocked<UserLocalStorageRepository>;
    userEmailUpdator = new UserEmailUpdator(userRepository);
    mockUser = UserMother.createRandomUser();
    userRepository.findById.mockResolvedValue(mockUser);
    userRepository.save = jest.fn().mockResolvedValue(undefined);
  })
  it('Should update the email successfully', async () =>{
    const newEmail = UserFactory.getRandomEmail(); 
    const updatedUser = await userEmailUpdator.execute(mockUser.id,newEmail);
    expect(userRepository.save).toBeCalled();
    expect(updatedUser.getEmail()).toBe(newEmail);
  });
  it(`Should not update the email when it hasn't been modified`, async () => {
    const sameEmail = mockUser.email;
    const updatedUser = await userEmailUpdator.execute(mockUser.id, sameEmail);
    expect(userRepository.save).not.toBeCalled();
    expect(updatedUser.email).toBe(sameEmail);
  });
  it(`Should not allow empty emails`, async () => {
    expect(() => new UserEmail('')).toThrow(UserEmailEmptyError);
  });
  it(`Should not allow invalid emails`, async () => {
    expect(() => new UserEmail('notvalid@email,com')).toThrow(UserEmailInvalidFormatError);
  });
});
