import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations = [
    new RequiredFieldValidation('name'),
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new RequiredFieldValidation('passwordConfirmation'),
  ];

  return new ValidationComposite(validations);
};
