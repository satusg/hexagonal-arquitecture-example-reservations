import { UserNameUpdator } from "../../../../src/users/application/updators/UserNameUpdator";
import { UserNotFoundError } from "../../../../src/users/domain/errors/UserNotFoundError";
import { UserRepository } from "../../../../src/users/domain/repositories/UserRepository";
import { User } from "../../../../src/users/domain/User";
import { UserName } from "../../../../src/users/domain/value-objects/UserName.value-objects";
import UserLocalStorageRepository from "../../../../src/users/infrastructure/UserLocalStorageRepository";
import { UserMother } from "../../domain/UserMother";  // Adjust the path to the location of UserMother

jest.mock("../../../../src/users/infrastructure/UserLocalStorageRepository");

describe("UserNameUpdator", () => {
  let userRepository: jest.Mocked<UserRepository>;
  let userNameUpdator: UserNameUpdator;
  let mockUser: User;

  beforeEach(() => {
    // Instantiate the mocked repository
    userRepository = new UserLocalStorageRepository() as jest.Mocked<UserLocalStorageRepository>;

    // Instantiate the use case
    userNameUpdator = new UserNameUpdator(userRepository);

    // Use the UserMother to create a mock user
    mockUser = UserMother.createDefaultUser(); // Or another method depending on the test scenario

    // Mock repository methods
    userRepository.findById.mockResolvedValue(mockUser);
    userRepository.save = jest.fn().mockResolvedValue(undefined);  // Mock save method
  });

  it("should update the user name successfully", async () => {
    const newName = new UserName("Jane");

    // Call the use case to update the name
    const updatedUser = await userNameUpdator.execute(mockUser.id, newName);

    // Verify that the repository save method was called with the updated user
    expect(userRepository.save).toHaveBeenCalledWith(updatedUser);

    // Verify that the user's name has been updated
    expect(updatedUser.getFullName()).toBe("Jane Doe");

    // Ensure that the updatedAt field has changed
    expect(updatedUser.getUpdatedAt()).not.toBe(mockUser.getUpdatedAt());
  });

  it("should throw UserNotFoundError when user is not found", async () => {
    // Mock findById to return null (user not found)
    userRepository.findById.mockResolvedValue(null);

    const newName = new UserName("Jane");

    // Verify that the error is thrown when the user is not found
    await expect(userNameUpdator.execute(mockUser.id, newName)).rejects.toThrow(UserNotFoundError);
  });

  it("should not update name if new name is the same", async () => {
    // Use the same name as the existing one
    const sameName = mockUser.name;

    // Call the use case with the same name
    const updatedUser = await userNameUpdator.execute(mockUser.id, sameName);

    // Ensure that save was not called since the name didn't change
    expect(userRepository.save).not.toHaveBeenCalled();

    // Verify that the user is returned without changes
    expect(updatedUser.getFullName()).toBe(mockUser.getFullName());
  });

  it("should handle errors when repository fails to save", async () => {
    const newName = new UserName("Jane");

    // Mock save to throw an error
    userRepository.save.mockRejectedValue(new Error("Failed to save"));

    // Call the use case and check if the error is thrown
    await expect(userNameUpdator.execute(mockUser.id, newName)).rejects.toThrow("Failed to save");
  });
});
