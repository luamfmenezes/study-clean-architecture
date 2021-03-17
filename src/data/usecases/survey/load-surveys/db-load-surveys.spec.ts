import { SurveyModel } from '../../../../domain/models/survey';
import { LoadSurveys } from '../../../../domain/usecases/survey/load-surveys';
import { LoadSurveysRepository } from '../../../protocols/db/survey/load-surveys-repository';
import { DbLoadSurveys } from './db-load-surveys';
import MockDate from 'mockdate';

interface SutTypes {
  sut: LoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
}

const makeSurveys = (): SurveyModel[] => [
  {
    id: 'valid-id-1',
    answers: [{ image: 'img-1.png', answer: 'answer-1' }],
    question: 'question-1',
    date: new Date(),
  },
  {
    id: 'valid-id-2',
    question: 'question-2',
    answers: [{ image: 'img-2.png', answer: 'answer-2' }],
    date: new Date(),
  },
];

const makeLoadSurveysRepositoryStub = () => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    loadAll = async (): Promise<SurveyModel[]> => makeSurveys();
  }
  return new LoadSurveysRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepositoryStub();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);
  return {
    sut,
    loadSurveysRepositoryStub,
  };
};

describe('DbLoadSurvey UseCase', () => {
  beforeEach(() => {
    MockDate.set(new Date());
  });
  afterEach(() => {
    MockDate.reset();
  });

  test('Shold call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();

    const spyLoadSurveys = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');

    await sut.load();

    expect(spyLoadSurveys).toHaveBeenCalled();
  });
  test('Shouw throws if loadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();

    jest
      .spyOn(loadSurveysRepositoryStub, 'loadAll')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const response = sut.load();

    expect(response).rejects.toThrow();
  });
  test('Shouw return the surveys', async () => {
    const { sut } = makeSut();

    const response = await sut.load();

    expect(response).toEqual(makeSurveys());
  });
});
