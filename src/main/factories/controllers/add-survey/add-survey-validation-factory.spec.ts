import { RequiredFieldValidation } from '../../../../validation/validators';
import { makeSurveyValidation } from './add-survey-validation-factory';

jest.mock('../../../../validation/validators/validation-composite');

describe('AddSurvey Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSurveyValidation();

    const validations = [
      new RequiredFieldValidation('question'),
      new RequiredFieldValidation('answer'),
    ];

    // expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
