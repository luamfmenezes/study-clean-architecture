import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../presentation/helpers/validators';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations = [
    new RequiredFieldValidation('name'),
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new RequiredFieldValidation('passwordConfirmation'),
    new CompareFieldsValidation('password', 'passwordConfirmation'),
    new EmailValidation('email', new EmailValidatorAdapter()),
  ];

  return new ValidationComposite(validations);
};
