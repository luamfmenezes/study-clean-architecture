export class EmailInUseError extends Error {
  constructor() {
    super('The recieved email is already in use');
    this.name = 'EmailInUseError';
  }
}
