import { User } from "../User";
import { UserEmail } from "../value-objects/UserEmail.value-objects";
import { UserId } from "../value-objects/UserId.value-objects";

export interface UserRepository {
    save(user: User): Promise<void>
    delete(userId: UserId): Promise<void>
    findById(userId: UserId): Promise<User | null>;
    findByEmail(email: UserEmail): Promise<User |null>;
    findAll(): Promise<User[]>;
}