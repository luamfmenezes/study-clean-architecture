import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
} from '../../../../validation/validators';
import { EmailValidator } from '../../../../validation/protocols/emailValidator';
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter';
import { makeSignUpValidation } from './signup-validation-factory';

// Refactory test

const makeEmailValidatorStub = (): EmailValidatorAdapter => {
  class EmailValidatorStub implements EmailValidator {
    isValid = (): boolean => true;
  }
  return new EmailValidatorStub();
};

jest.mock('../../../../validation/validators/validation-composite');

describe('SigunUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();

    const emailValidatorStub = makeEmailValidatorStub();

    const validations = [
      new RequiredFieldValidation('name'),
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new RequiredFieldValidation('passwordConfirmation'),
      new CompareFieldsValidation('password', 'passwordConfirmation'),
      new EmailValidation('email', new EmailValidatorAdapter()),
    ];

    // expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
