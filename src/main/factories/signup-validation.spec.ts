import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { makeSignUpValidation } from './signup-validation';

jest.mock('../../presentation/helpers/validators/validation-composite');

describe('SigunUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();

    const validations = [
      new RequiredFieldValidation('name'),
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new RequiredFieldValidation('passwordConfirmation'),
    ];

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
