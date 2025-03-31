export const USER_NAME_MIN_LENGTH = 3;
export const USER_NAME_MAX_LENGTH = 20;

export class UserSurname {
    constructor(private readonly value: string){
        this.validate();
    }
    private validate(){
        if(!this.value){
            throw new UserSurnameEmptyError("The User Surname can't be empty");
        }
        if(this.value.length < USER_NAME_MIN_LENGTH){
            throw new UserSurnameTooShortError(`The User Surname should contain at least ${USER_NAME_MIN_LENGTH} characters`);
        }
        if(this.value.length > USER_NAME_MAX_LENGTH){
            throw new UserSurnameTooLongError(`The User Surname should contain at most ${USER_NAME_MAX_LENGTH} characters`);
        }
    }
    public toString(): string {
        return this.value;
    }
}

export class UserSurnameEmptyError extends Error {
    constructor(message:string){
        super(message);
        this.name = "UserSurnameMissingValueError";
    }
}

export class UserSurnameTooShortError extends Error {
    constructor(message:string){
        super(message);
        this.name = "UserSurnameTooShortError";
    }
}

export class UserSurnameTooLongError extends Error {
    constructor(message:string){
        super(message);
        this.name = "UserSurnameTooLongError";
    }
}