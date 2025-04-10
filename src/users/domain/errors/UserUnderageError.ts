export class UserUnderageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserUnderageError';
  }
}
