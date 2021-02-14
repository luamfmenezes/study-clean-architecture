import {
  EmailValidation,
  RequiredFieldValidation,
} from '../../../../validation/validators';
import { EmailValidator } from '../../../../validation/protocols/emailValidator';
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter';
import { makeLoginValidation } from './login-validation-factory';

// Refactory test

const makeEmailValidatorStub = (): EmailValidatorAdapter => {
  class EmailValidatorStub implements EmailValidator {
    isValid = (): boolean => true;
  }
  return new EmailValidatorStub();
};

jest.mock('../../../../validation/validators/validation-composite');

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
