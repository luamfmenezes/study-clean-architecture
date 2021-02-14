import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../../validation/validators';
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter';

export const makeLoginValidation = (): ValidationComposite => {
  const validations = [
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new EmailValidation('email', new EmailValidatorAdapter()),
  ];

  return new ValidationComposite(validations);
};
