import validator from 'validator';
import { EmailValidatorAdapter } from './email-validator-adapter';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeSut = (): EmailValidatorAdapter => new EmailValidatorAdapter();

describe('EmailValidator Adapter', () => {
  test('Should return false if validator return false', () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const sut = makeSut();
    const isValid = sut.isValid('invalid@email.com');
    expect(isValid).toBeFalsy();
  });
  test('Should return true if validator return true', () => {
    const sut = makeSut();
    const isValid = sut.isValid('valid@email.com');
    expect(isValid).toBeTruthy();
  });
  test('Should call validator with correct email', () => {
    const sut = makeSut();
    const isValidSpy = jest.spyOn(validator, 'isEmail');
    sut.isValid('valid@email.com');
    expect(isValidSpy).toHaveBeenCalledWith('valid@email.com');
  });
});
