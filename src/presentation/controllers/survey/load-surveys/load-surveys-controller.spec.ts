import MockDate from 'mockdate';
import {
  SurveyModel,
  LoadSurveys,
  noContent,
  ok,
  serverError,
} from './load-surveys-controller-protocols';
import { Controller } from '../../../protocols';
import { LoadSurveysController } from './load-surveys-controller';

interface SutTypes {
  sut: Controller;
  loadSurveysStub: LoadSurveys;
}

const makeSurveys = (): SurveyModel[] => [
  {
    answers: [{ answer: 'answer-one', image: 'img.png' }],
    date: new Date(),
    id: 'valid-id',
    question: 'question',
  },
];

const makeLoadSurveysStub = () => {
  class LoadSurveysStub implements LoadSurveys {
    load = async (): Promise<SurveyModel[]> => makeSurveys();
  }
  return new LoadSurveysStub();
};

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveysStub();
  const sut = new LoadSurveysController(loadSurveysStub);
  return {
    sut,
    loadSurveysStub,
  };
};

describe('Load Surveys Controller', () => {
  beforeEach(() => {
    MockDate.set(new Date());
  });
  afterEach(() => {
    MockDate.reset();
  });
  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut();

    const spyValidationStub = jest.spyOn(loadSurveysStub, 'load');

    await sut.handle({});

    expect(spyValidationStub).toHaveBeenCalled();
  });
  test('Should return serverError if LoadSurvey trhows', async () => {
    const { sut, loadSurveysStub } = makeSut();

    jest.spyOn(loadSurveysStub, 'load').mockImplementation(() => {
      throw new Error();
    });

    const response = await sut.handle({});

    expect(response).toEqual(serverError(new Error()));
  });
  test('Should return ok with surveys if it success', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({});

    expect(response).toEqual(ok(makeSurveys()));
  });
  test('Should return 204 if loadSurvey return an empty array', async () => {
    const { sut, loadSurveysStub } = makeSut();

    jest.spyOn(loadSurveysStub, 'load').mockResolvedValue([]);

    const response = await sut.handle({});

    expect(response).toEqual(noContent());
  });
});
