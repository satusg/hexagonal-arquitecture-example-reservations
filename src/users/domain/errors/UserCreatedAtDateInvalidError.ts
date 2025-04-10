export class UserCreatedAtDateInvalidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserCreatedAtDateInvalidError';
  }
}
