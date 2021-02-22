import {
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../../../validation/validators';

export const makeSurveyValidation = (): ValidationComposite => {
  const validations = [
    new RequiredFieldValidation('question'),
    new RequiredFieldValidation('answers'),
  ];

  return new ValidationComposite(validations);
};
