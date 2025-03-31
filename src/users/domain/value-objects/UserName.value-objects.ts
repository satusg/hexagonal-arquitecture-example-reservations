import { UserNameEmptyError } from "../errors/UserNameEmptyError";
import { UserNameTooLongError } from "../errors/UserNameTooLongError";
import { UserNameTooShortError } from "../errors/UserNameTooShortError";

export const USER_NAME_MIN_LENGTH = 3;
export const USER_NAME_MAX_LENGTH = 20;

export class UserName {
    constructor(private readonly value: string){
        this.validate();
    }
    private validate(){
        if(!this.value){
            throw new UserNameEmptyError("The User Name can't be empty");
        }
        if(this.value.length < USER_NAME_MIN_LENGTH){
            throw new UserNameTooShortError(`The User Name should contain at least ${USER_NAME_MIN_LENGTH} characters`);
        }
        if(this.value.length > USER_NAME_MAX_LENGTH){
            throw new UserNameTooLongError(`The User Name should contain at most ${USER_NAME_MAX_LENGTH} characters`);
        }
    }
    public toString(): string {
        return this.value;
    }
}

