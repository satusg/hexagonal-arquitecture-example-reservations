import { UserEmailAlreadyInUseError } from "../../domain/errors/UserEmailAlreadyInUseError";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/User";
import { UserEmail } from "../../domain/value-objects/UserEmail.value-objects";
import { UserId } from "../../domain/value-objects/UserId.value-objects";
import { UserBuilder } from "../builders/UserBuilder";
import { UserFindById } from "../finders/UserFindById";

export class UserEmailUpdator {
    private userFindById: UserFindById;
    constructor(private readonly repository: UserRepository) {
        this.userFindById = new UserFindById(repository);
    }

    public async execute(userId: UserId, newEmail: UserEmail): Promise<User> {
        const user = await this.userFindById.execute(userId);

        if (user.getEmail().toString() === newEmail.toString()) {
            return user; 
        }

        const existingUser = await this.repository.findByEmail(newEmail);
        if (existingUser) {
            throw new UserEmailAlreadyInUseError("User email already being used");
        }

        const updatedUser = UserBuilder.fromUser(user).setEmail(newEmail).build()

        await this.repository.save(updatedUser);

        return updatedUser;
    }
}
