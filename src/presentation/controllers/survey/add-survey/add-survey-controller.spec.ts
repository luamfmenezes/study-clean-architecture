import {
  badRequest,
  noContent,
  serverError,
} from '../../../helpers/http/http-helper';
import { Controller, HttpRequest, Validation } from '../../../protocols';
import { AddSurveyController } from './add-survey-controller';
import { AddSurvey } from './add-survey-controller-protocols';

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate = (): Error | undefined => undefined;
  }
  return new ValidationStub();
};
const makeAddSurveyStub = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    add = async (): Promise<void> => undefined;
  }
  return new AddSurveyStub();
};

interface SutTypes {
  sut: Controller;
  validationStub: Validation;
  addSurveyStub: AddSurvey;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub();
  const addSurveyStub = makeAddSurveyStub();
  const sut = new AddSurveyController(validationStub, addSurveyStub);
  return {
    addSurveyStub,
    validationStub,
    sut,
  };
};

const makeFakeAddSurveyBody = () => ({
  question: 'any_question',
  answer: [
    {
      image: 'image.png',
      answer: 'answer',
    },
  ],
});

const makeFakeHttpRequest = (): HttpRequest => ({
  body: makeFakeAddSurveyBody(),
});

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const spyValidationStub = jest.spyOn(validationStub, 'validate');

    await sut.handle(makeFakeHttpRequest());

    expect(spyValidationStub).toBeCalledWith(makeFakeAddSurveyBody());
  });
  test('Should return badRequest if Validation return one error', async () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, 'validate')
      .mockImplementation(() => new Error());

    const repsonse = await sut.handle(makeFakeHttpRequest());

    expect(repsonse).toEqual(badRequest(new Error()));
  });
  test('Should call addSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut();

    const spyAddSurvey = jest.spyOn(addSurveyStub, 'add');

    await sut.handle(makeFakeHttpRequest());

    expect(spyAddSurvey).toBeCalledWith(makeFakeAddSurveyBody());
  });
  test('Should return serverError if addSurvay trhows', async () => {
    const { sut, addSurveyStub } = makeSut();

    jest.spyOn(addSurveyStub, 'add').mockImplementation(() => {
      throw new Error();
    });

    const response = await sut.handle(makeFakeHttpRequest());

    expect(response).toEqual(serverError(new Error()));
  });
  test('Should return 204 on success', async () => {
    const { sut } = makeSut();

    const response = await sut.handle(makeFakeHttpRequest());

    expect(response).toEqual(noContent());
  });
});
