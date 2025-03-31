import { UserSurnameUpdator } from "../../../../src/users/application/updators/UserSurnameUpdator";
import { UserNotFoundError } from "../../../../src/users/domain/errors/UserNotFoundError";
import { UserRepository } from "../../../../src/users/domain/repositories/UserRepository";
import { User } from "../../../../src/users/domain/User";
import UserLocalStorageRepository from "../../../../src/users/infrastructure/UserLocalStorageRepository";
import { UserFactory } from "../../domain/UserFactory";
import { UserMother } from "../../domain/UserMother";  // Adjust the path to the location of UserMother

jest.mock("../../../../src/users/infrastructure/UserLocalStorageRepository");

describe("UserSurnameUpdator", () => {
  let userRepository: jest.Mocked<UserRepository>;
  let userSurnameUpdator: UserSurnameUpdator;
  let mockUser: User;

  beforeEach(() => {
    userRepository = new UserLocalStorageRepository() as jest.Mocked<UserLocalStorageRepository>;

    userSurnameUpdator = new UserSurnameUpdator(userRepository);

    mockUser = UserMother.createDefaultUser(); // Or another method depending on the test scenario

    userRepository.findById.mockResolvedValue(mockUser);
    userRepository.save = jest.fn().mockResolvedValue(undefined);  // Mock save method
  });

  it("should update the user surname successfully", async () => {
    const newSurname = UserFactory.getRandomSurname();

    const updatedUser = await userSurnameUpdator.execute(mockUser.id, newSurname);

    expect(userRepository.save).toHaveBeenCalledWith(updatedUser);

    expect(updatedUser.getFullName()).toBe(mockUser.name + " " + newSurname.toString());

    expect(updatedUser.getUpdatedAt()).not.toBe(mockUser.getUpdatedAt());
  });

  it("should throw UserNotFoundError when user is not found", async () => {
    userRepository.findById.mockResolvedValue(null);

    const newSurname = UserFactory.getRandomSurname();

    await expect(userSurnameUpdator.execute(mockUser.id, newSurname)).rejects.toThrow(UserNotFoundError);
  });

  it("should not update Surname if new Surname is the same", async () => {
    const sameSurname = mockUser.surname;
    
    const updatedUser = await userSurnameUpdator.execute(mockUser.id, sameSurname);

    expect(userRepository.save).not.toHaveBeenCalled();

    expect(updatedUser.getFullName()).toBe(mockUser.getFullName());
  });
});
