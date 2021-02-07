import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation';
import { EmailValidation } from '../../presentation/helpers/validators/email-validation';
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { EmailValidator } from '../../presentation/protocols/emailValidator';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { makeSignUpValidation } from './signup-validation';

// Refactory test

const makeEmailValidatorStub = (): EmailValidatorAdapter => {
  class EmailValidatorStub implements EmailValidator {
    isValid = (): boolean => true;
  }
  return new EmailValidatorStub();
};

jest.mock('../../presentation/helpers/validators/validation-composite');

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
