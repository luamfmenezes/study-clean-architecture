import { DbLoadSurveyById } from './db-load-survey-by-id';
import { LoadSurveyByIdRepository } from '../../../protocols/db/survey/load-survey-by-id-repository';
import MockDate from 'mockdate';
import { SurveyModels } from '../../../../domain/models/survey';

const makeSurvey = (): SurveyModels => ({
  id: 'valid-id-1',
  answers: [{ image: 'img-1.png', answer: 'answer-1' }],
  question: 'question-1',
  date: new Date(),
});

const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    loadById = async (): Promise<SurveyModels | undefined> => makeSurvey();
  }
  return new LoadSurveyByIdRepositoryStub();
};

interface SutTypes {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);
  return { sut, loadSurveyByIdRepositoryStub };
};

describe('DbLoadSurveyById UseCase', () => {
  beforeEach(() => {
    MockDate.set(new Date());
  });
  afterEach(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveyByIdRepository with correct values', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    await sut.loadById('id');
    expect(loadByIdSpy).toHaveBeenCalledWith('id');
  });

  test('Should call LoadSurveyByIdRepository with correct values', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    await sut.loadById('id');
    expect(loadByIdSpy).toHaveBeenCalledWith('id');
  });

  test('Should return Survey on Success', async () => {
    const { sut } = makeSut();
    const survey = await sut.loadById('id');
    expect(survey).toEqual(makeSurvey());
  });

  test('Should trhows if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockImplementation(() => {
        throw new Error();
      });
    const response = sut.loadById('id');
    await expect(response).rejects.toThrow();
  });
});
