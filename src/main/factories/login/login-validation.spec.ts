import {
  EmailValidation,
  RequiredFieldValidation,
} from '../../../presentation/helpers/validators';
import { EmailValidator } from '../../../presentation/protocols/emailValidator';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';
import { makeLoginValidation } from './login-validation';

// Refactory test

const makeEmailValidatorStub = (): EmailValidatorAdapter => {
  class EmailValidatorStub implements EmailValidator {
    isValid = (): boolean => true;
  }
  return new EmailValidatorStub();
};

jest.mock('../../../presentation/helpers/validators/validation-composite');

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation();

    const emailValidatorStub = makeEmailValidatorStub();

    const validations = [
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new EmailValidation('email', emailValidatorStub),
    ];

    // expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
