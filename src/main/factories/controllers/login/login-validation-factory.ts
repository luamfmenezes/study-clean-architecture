import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../../presentation/helpers/validators';
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter';

export const makeLoginValidation = (): ValidationComposite => {
  const validations = [
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new EmailValidation('email', new EmailValidatorAdapter()),
  ];

  return new ValidationComposite(validations);
};
