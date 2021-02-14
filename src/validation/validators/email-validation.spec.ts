import { InvalidParamError } from '../../presentation/errors';
import { EmailValidator } from '../protocols/emailValidator';
import { EmailValidation } from './email-validation';

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid = (): boolean => true;
  }
  return new EmailValidatorStub();
};

interface SutTypes {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub();
  const sut = new EmailValidation('email', emailValidatorStub);
  return { sut, emailValidatorStub };
};
describe('EmailValidation', () => {
  test('Shoul call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();

    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid');

    sut.validate({ email: 'jhondoe@email.com' });

    expect(emailValidatorSpy).toHaveBeenCalledWith('jhondoe@email.com');
  });
  test('Shoul return error when isValid returns false', () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const errorValidate = sut.validate({ email: 'jhondoe@email.com' });

    expect(errorValidate).toEqual(new InvalidParamError('email'));
  });
  test('Shoul not dispatch any error when isValid return true', () => {
    const { sut } = makeSut();

    const errorValidate = sut.validate({ email: 'jhondoe@email.com' });

    expect(errorValidate).toBeUndefined();
  });
});
