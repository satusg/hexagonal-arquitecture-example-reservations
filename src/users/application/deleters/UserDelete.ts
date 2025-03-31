import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserId } from "../../domain/value-objects/UserId.value-objects";

export class UserDelete {
    constructor(private repository: UserRepository){}
    
    public async execute(userId: UserId): Promise<void> {
        await this.repository.delete(userId);
    }
}