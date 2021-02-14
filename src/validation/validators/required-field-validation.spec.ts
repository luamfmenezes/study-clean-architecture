import { MissingParamError } from '../../presentation/errors';
import { RequiredFieldValidation } from './required-field-validation';

const makeSut = (): RequiredFieldValidation =>
  new RequiredFieldValidation('field');

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ otherField: 'value' });
    expect(error).toEqual(new MissingParamError('field'));
  });
  test('Should not return an error if field is informated', () => {
    const sut = makeSut();
    const error = sut.validate({ field: 'value' });
    expect(error).toBeUndefined();
  });
});
