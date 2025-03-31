import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/User";
import { UserId } from "../../domain/value-objects/UserId.value-objects";
import { UserName } from "../../domain/value-objects/UserName.value-objects";
import { UserBuilder } from "../builders/UserBuilder";
import { UserFindById } from "../finders/UserFindById";

export class UserNameUpdator {
    private userFindById: UserFindById;

    constructor(private readonly repository: UserRepository) {
        this.userFindById = new UserFindById(repository);
    }

    public async execute(userId: UserId, newName: UserName): Promise<User> {
        const user = await this.userFindById.execute(userId);
        if(user.name === newName){
            return user;
        }
        const updatedUser = UserBuilder.fromUser(user).setName(newName).build();

        await this.repository.save(updatedUser);

        return updatedUser;
    }
}
