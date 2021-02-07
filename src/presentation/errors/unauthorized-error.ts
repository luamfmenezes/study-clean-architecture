export class UnauthorizedError extends Error {
  constructor() {
    super('Unaurhtorized');
    this.name = 'UnauthorizedError';
  }
}
