export class UserIdMissingValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserIdMissingValueError';
  }
}
