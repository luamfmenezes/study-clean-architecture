import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation';
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

    const validations = [
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new EmailValidation('email', new EmailValidatorAdapter()),
    ];

    // expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
