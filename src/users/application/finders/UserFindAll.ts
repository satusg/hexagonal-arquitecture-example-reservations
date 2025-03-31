import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/User";

export class UserFindById {
    constructor(private readonly repository: UserRepository) {}

    public async execute(): Promise<User[]> {
        const users = await this.repository.findAll();
        return users;
    }
}
