export class UserNameTooShortError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserNameTooShortError';
  }
}
