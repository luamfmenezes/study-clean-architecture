import { Validation } from '../../presentation/protocols';
import { ValidationComposite } from './validation-composite';

interface SutTypes {
  sut: Validation;
  validationStubs: Validation[];
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate = (): Error | undefined => undefined;
  }
  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStubs = [
    makeValidation(),
    makeValidation(),
    makeValidation(),
  ];
  const sut = new ValidationComposite(validationStubs);
  return { sut, validationStubs };
};

describe('Validation Compose', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut();

    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValue(new Error('error'));

    const error = sut.validate({});

    expect(error).toEqual(new Error('error'));
  });
  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut();

    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValue(new Error('error-1'));

    jest
      .spyOn(validationStubs[2], 'validate')
      .mockReturnValue(new Error('error-2'));

    const error = sut.validate({});

    expect(error).toEqual(new Error('error-1'));
  });
  test('Should validate all validations succed', () => {
    const { sut } = makeSut();
    const error = sut.validate({});
    expect(error).toBeUndefined();
  });
});
