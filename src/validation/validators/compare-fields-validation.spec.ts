import { InvalidParamError } from '../../presentation/errors';
import { CompareFieldsValidation } from './compare-fields-validation';

const makeSut = (): CompareFieldsValidation =>
  new CompareFieldsValidation('field', 'fieldConfirmation');

describe('Compare Fields Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({
      field: 'value',
      fieldConfirmation: 'other-value',
    });
    expect(error).toEqual(new InvalidParamError('fieldConfirmation'));
  });
  test('Should not return an error if field is informated', () => {
    const sut = makeSut();
    const error = sut.validate({ field: 'value', fieldConfirmation: 'value' });
    expect(error).toBeUndefined();
  });
});
