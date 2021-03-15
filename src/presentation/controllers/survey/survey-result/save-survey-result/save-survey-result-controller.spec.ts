import MockDate from 'mockdate';
import { SaveSurveyResultController } from './save-survey-result-controller';
import {
  forbidden,
  ok,
  serverError,
} from '../../../../helpers/http/http-helper';
import { HttpRequest } from '../../add-survey/add-survey-controller-protocols';
import { LoadSurveyById } from '../../../../../domain/usecases/survey/load-surveys-by-id';
import { SurveyModels } from '../../../../../domain/models/survey';
import { InvalidParamError } from '../../../../errors';
import {
  SaveSurveyResult,
  SaveSurveyResultModel,
} from '../../../../../domain/usecases/survey-result/save-survey-result';
import { SurveyResultModel } from '../../../../../domain/models/survey-result';

interface SutTypes {
  sut: SaveSurveyResultController;
  loadSurveyById: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
}

const makeFakeSurvey = (): SurveyModels => ({
  id: 'valid-id',
  question: 'question',
  answers: [
    { answer: 'answer', image: 'image.png' },
    { answer: 'answer2', image: 'image2.png' },
  ],
  date: new Date(),
});

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'id',
  surveyId: 'survey-id',
  accountId: 'account-id',
  date: new Date(),
  answer: 'answer',
});

const makeLoadSurveyById = (): LoadSurveyById => {
  class DbLoadSurveyByIdStub implements LoadSurveyById {
    loadById = async (): Promise<SurveyModels | undefined> => makeFakeSurvey();
  }
  return new DbLoadSurveyByIdStub();
};

const makeSaveSurveyResultStub = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    save = async (data: SaveSurveyResultModel): Promise<SurveyResultModel> => ({
      ...data,
      id: 'id',
    });
  }
  return new SaveSurveyResultStub();
};

const makeSut = (): SutTypes => {
  const loadSurveyById = makeLoadSurveyById();
  const saveSurveyResultStub = makeSaveSurveyResultStub();
  const sut = new SaveSurveyResultController(
    loadSurveyById,
    saveSurveyResultStub,
  );
  return { sut, loadSurveyById, saveSurveyResultStub };
};

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'survey-id',
  },
  body: {
    answer: 'answer',
  },
  accountId: 'account-id',
});

describe('SaveSurveyResult Controller', () => {
  beforeEach(() => {
    MockDate.set(new Date());
  });
  afterEach(() => {
    MockDate.reset();
  });
  test('Should call loadSurveyById with surveyId param', async () => {
    const { sut, loadSurveyById } = makeSut();

    const loadByIdSpy = jest.spyOn(loadSurveyById, 'loadById');

    await sut.handle(makeFakeRequest());

    expect(loadByIdSpy).toHaveBeenCalledWith('survey-id');
  });
  test('Should return 403 if loadSurveyById returns null', async () => {
    const { sut, loadSurveyById } = makeSut();

    jest.spyOn(loadSurveyById, 'loadById').mockResolvedValueOnce(undefined);

    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')));
  });
  test('Should return 500 if loadSurveyById throws', async () => {
    const { sut, loadSurveyById } = makeSut();

    jest.spyOn(loadSurveyById, 'loadById').mockImplementationOnce(() => {
      throw new Error();
    });

    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(serverError(new Error()));
  });
  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut();

    const request = { ...makeFakeRequest() };

    request.body.answer = 'invalid-asnwer';

    const response = await sut.handle(request);

    expect(response).toEqual(forbidden(new InvalidParamError('answer')));
  });

  test('Should call saveSurveyResult with valid data', async () => {
    const { sut, saveSurveyResultStub } = makeSut();

    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');

    await sut.handle(makeFakeRequest());

    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'survey-id',
      accountId: 'account-id',
      date: new Date(),
      answer: 'answer',
    });
  });

  test('Should return ok 200 when provided with valid data', async () => {
    const { sut } = makeSut();

    const respose = await sut.handle(makeFakeRequest());

    expect(respose).toEqual(ok(makeFakeSurveyResult()));
  });
});
