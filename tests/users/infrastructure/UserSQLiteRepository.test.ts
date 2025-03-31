import { User } from "../../../src/users/domain/User";
import { UserSQLiteRepository } from "../../../src/users/infrastructure/UserSQLiteRepository";
import { UserFactory } from "../domain/UserFactory";
import { UserMother } from "../domain/UserMother";
import { DatabaseInitializationError } from "../../../src/users/domain/errors/DatabaseInitializationError";
import { UserEmail } from "../../../src/users/domain/value-objects/UserEmail.value-objects";
import { UserId } from "../../../src/users/domain/value-objects/UserId.value-objects";
import { UserBuilder } from "../../../src/users/application/builders/UserBuilder";
import * as fs from 'fs';
import * as path from 'path';

describe('UserSQLiteRepository', () => {
    let repository: UserSQLiteRepository;
    let mockUser: User;
    const testDbPath = path.join(__dirname, 'test.db');
    
    beforeAll(async () => {
        mockUser = UserMother.createDefaultUser();
        repository = new UserSQLiteRepository(testDbPath);
    });

    afterEach(async () => {
        const users = await repository.findAll();
        await Promise.all(users.map(user => repository.delete(user.id)));
    });
    
    afterAll(async () => {
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath);
        }
    });
    
    it('should save and retrieve the saved user', async () => {
        await repository.save(mockUser);
        const userFoundById = await repository.findById(mockUser.id);
        expect(userFoundById).toEqual(mockUser);
    });

    it('should not return users when there are no saved users', async () => {
        const usersFound = await repository.findAll();
        expect(Array.isArray(usersFound)).toBe(true);
        expect(usersFound.length).toBe(0);
    });

    it('should be able to delete an existing user', async () => {
        await repository.save(mockUser);
        await repository.delete(mockUser.id);
        const deletedUser = await repository.findById(mockUser.id);
        expect(deletedUser).toBeNull();
    });

    it('should return all created users', async () => {
        const user1 = UserFactory.createRandomUser();
        const user2 = UserFactory.createRandomUser();
        const user3 = UserFactory.createRandomUser();

        const users = [user1, user2, user3];
        await Promise.all(users.map(user => repository.save(user)));
        
        const usersFound = await repository.findAll();
        expect(usersFound).toHaveLength(3);
        expect(usersFound).toContainEqual(user1);
        expect(usersFound).toContainEqual(user2);
        expect(usersFound).toContainEqual(user3);
    });

    it('should not find non-existent user by email', async () => {
        const nonExistentEmail = new UserEmail('nonexistent@example.com');
        const userFound = await repository.findByEmail(nonExistentEmail);
        expect(userFound).toBeNull();
    });

    it('should not find non-existent user by id', async () => {
        const nonExistentId = UserId.create('00000000-0000-7000-0000-000000000000');
        const userFound = await repository.findById(nonExistentId);
        expect(userFound).toBeNull();
    });

    it('should find user by email', async () => {
        await repository.save(mockUser);
        const userFoundByEmail = await repository.findByEmail(mockUser.email);
        expect(userFoundByEmail).toEqual(mockUser);
    });

    it('should update existing user when saving with same id', async () => {
        const updatedUser = UserBuilder.fromUser(mockUser)
            .setName(UserFactory.getRandomName())
            .setSurname(UserFactory.getRandomSurname())
            .setEmail(UserFactory.getRandomEmail())
            .setDateOfBirth(UserFactory.getRandomUserDateOfBirth())
            .build();

        await repository.save(mockUser);
        await repository.save(updatedUser);
        const userFound = await repository.findById(mockUser.id);
        
        expect(userFound).toEqual(updatedUser);
        expect(userFound).not.toEqual(mockUser);
    });

    it('should handle database initialization error', () => {
        expect(() => {
            new UserSQLiteRepository('');
        }).toThrow(DatabaseInitializationError);
    });

    it('should maintain unique email constraint', async () => {
        const user1 = UserFactory.createRandomUser();
        const user2 = UserFactory.createRandomUser();
        
        const user2WithSameEmail = UserBuilder.fromUser(user2)
            .setEmail(user1.email)
            .build();

        await repository.save(user1);
        await repository.save(user2WithSameEmail);
        const userFoundByEmail = await repository.findByEmail(user1.email);
        
        expect(userFoundByEmail).toEqual(user2WithSameEmail);
    });

    it('should handle date serialization correctly', async () => {
        const user = UserFactory.createRandomUser();

        await repository.save(user);
        const userFound = await repository.findById(user.id);
        expect(userFound).not.toBeNull();
        expect(userFound?.dateOfBirth.toString()).toBe(user.dateOfBirth.toString());
        expect(userFound?.getCreatedAt()).toBe(user.getCreatedAt());
        expect(userFound?.getUpdatedAt()).toBe(user.getUpdatedAt());
    });

    it('should handle UUID serialization correctly', async () => {
        const user = UserFactory.createRandomUser();
        
        await repository.save(user);
        const userFound = await repository.findById(user.id);
        expect(userFound).not.toBeNull();
        expect(userFound?.id.toString()).toBe(user.id.toString());
    });

    it('should handle concurrent operations correctly', async () => {
        const user1 = UserFactory.createRandomUser();
        const user2 = UserFactory.createRandomUser();
        const user3 = UserFactory.createRandomUser();

        await Promise.all([
            repository.save(user1),
            repository.save(user2),
            repository.save(user3)
        ]);

        const usersFound = await repository.findAll();
        expect(usersFound).toHaveLength(3);
        expect(usersFound).toContainEqual(user1);
        expect(usersFound).toContainEqual(user2);
        expect(usersFound).toContainEqual(user3);
    });
});