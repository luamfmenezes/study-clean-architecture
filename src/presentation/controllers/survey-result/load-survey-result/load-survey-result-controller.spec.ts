import { HttpRequest } from '../../../protocols';
import { LoadSurveyResultController } from './load-survey-result-controller';
import { LoadSurveyById } from '../../../../domain/usecases/survey/load-surveys-by-id';
import { LoadSurveyResult } from '../../../../domain/usecases/survey-result/load-survey-result';
import { SurveyModel } from '../../../../domain/models/survey';
import { forbidden, serverError, ok } from '../../../helpers/http/http-helper';
import { InvalidParamError } from '../../../errors';
import { SurveyResultModel } from '../../../../domain/models/survey-result';

interface SutTypes {
  sut: LoadSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  loadSurveyResultStub: LoadSurveyResult;
}

const mockRequestHttp = (): HttpRequest => ({
  params: {
    surveyId: 'survey-id',
  },
});

const mockSurveyModel = (): SurveyModel => ({
  answers: [{ answer: 'answer', image: 'image.png' }],
  date: new Date(),
  id: 'id',
  question: 'question',
});

const mockSruveyResultModel = (): SurveyResultModel => ({
  question: 'question',
  answers: [{ answer: 'answer', image: 'image.png', count: 1, percent: 100 }],
  surveyId: 'survey-id',
});

const mockLoadSurveyByIdStub = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    loadById = async (): Promise<SurveyModel | undefined> => mockSurveyModel();
  }
  return new LoadSurveyByIdStub();
};

const mockLoadSurveyResultStub = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    load = async (): Promise<SurveyResultModel | undefined> =>
      mockSruveyResultModel();
  }
  return new LoadSurveyResultStub();
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyByIdStub();
  const loadSurveyResultStub = mockLoadSurveyResultStub();
  const sut = new LoadSurveyResultController(
    loadSurveyByIdStub,
    loadSurveyResultStub,
  );
  return { sut, loadSurveyByIdStub, loadSurveyResultStub };
};

describe('LoadSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

    await sut.handle(mockRequestHttp());

    expect(loadByIdSpy).toHaveBeenCalledWith('survey-id');
  });
  test('Should return 403 if LoadSurveyById return undefined', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(undefined);

    const response = await sut.handle(mockRequestHttp());

    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')));
  });
  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();

    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(() => {
      throw new Error();
    });

    const response = await sut.handle(mockRequestHttp());

    expect(response).toEqual(serverError(new Error()));
  });
  test('Should call LoadSurveyResult with correct value', async () => {
    const { sut, loadSurveyResultStub } = makeSut();

    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load');

    await sut.handle(mockRequestHttp());

    expect(loadSpy).toHaveBeenCalledWith('survey-id');
  });
  test('Should return 500 if LoadSurveyResult trhows', async () => {
    const { sut, loadSurveyResultStub } = makeSut();

    jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(() => {
      throw new Error();
    });

    const respose = await sut.handle(mockRequestHttp());

    expect(respose).toEqual(serverError(new Error()));
  });
  test('Should return 200 when provided with valid data', async () => {
    const { sut } = makeSut();

    const respose = await sut.handle(mockRequestHttp());

    expect(respose).toEqual(ok(mockSruveyResultModel()));
  });
});
