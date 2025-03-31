import { User } from "../../../src/users/domain/User";
import UserLocalStorageRepository from "../../../src/users/infrastructure/UserLocalStorageRepository";
import { UserFactory } from "../domain/UserFactory";
import { UserMother } from "../domain/UserMother";

describe('UserLocalStorageRepository', () => {
    let repository: UserLocalStorageRepository;
    let mockUser: User;
    beforeEach(() => {
        mockUser = UserMother.createDefaultUser();
        repository = new UserLocalStorageRepository();        
    });
    
    it('should save a retrieve the saved user', async () => {
        repository.save(mockUser);
        const userFoundById = await repository.findById(mockUser.id);
        expect(userFoundById).toBe(mockUser);
    });

    it('should not return users when there are no saved users', async () =>{
        const usersFound = await repository.findAll();
        expect(usersFound).toStrictEqual([]);
    });

    it('should be able to delete an existign user', async () => {
        await repository.save(mockUser);
        expect(await repository.delete(mockUser.id)).toBeUndefined();
    });

    it('should return the created users', async () => {
        await repository.save(UserFactory.createRandomUser());
        await repository.save(UserFactory.createRandomUser());
        await repository.save(UserFactory.createRandomUser());
        expect((await repository.findAll()).length).toBe(3);  
    });

    it('should not find non created user by email', async () =>{
        expect(await repository.findByEmail(mockUser.email)).toBeNull();
    });

    it('should not find non created user by id', async () =>{
        expect(await repository.findById(mockUser.id)).toBeNull();
    });
});