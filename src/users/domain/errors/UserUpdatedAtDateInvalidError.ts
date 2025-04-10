export class UserUpdatedAtDateInvalidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserUpdatedAtDateInvalidError';
  }
}
