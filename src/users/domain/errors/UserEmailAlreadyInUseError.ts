export class UserEmailAlreadyInUseError extends Error  {
    constructor(message: string){
        super(message);
        this.name = "UserEmailAlreadyInUseError";
    }
}