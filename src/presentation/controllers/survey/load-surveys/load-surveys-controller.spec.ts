import MockDate from 'mockdate';
import {
  SurveyAnswerModel,
  SurveyModels,
} from '../../../../domain/models/survey';
import { AddSurveyModel } from '../../../../domain/usecases/add-survey';
import { Controller, HttpRequest } from '../../../protocols';
import { LoadSurveysController } from './load-surveys-controller';
import { LoadSurveys } from '../../../../domain/usecases/load-surveys';
import { ok, serverError } from '../../../helpers/http/http-helper';

interface SutTypes {
  sut: Controller;
  loadSurveysStub: LoadSurveys;
}

const makeSurveys = (): SurveyModels[] => [
  {
    answers: [{ answer: 'answer-one', image: 'img.png' }],
    date: new Date(),
    id: 'valid-id',
    question: 'question',
  },
];

const makeLoadSurveysStub = () => {
  class LoadSurveysStub implements LoadSurveys {
    load = async (): Promise<SurveyModels[]> => makeSurveys();
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

const makeFakeSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  date: new Date(),
  answers: [
    {
      image: 'image.png',
      answer: 'answer',
    },
  ],
});

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
  test('Should return surveys if success', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({});

    expect(response).toEqual(ok(makeSurveys()));
  });
});
