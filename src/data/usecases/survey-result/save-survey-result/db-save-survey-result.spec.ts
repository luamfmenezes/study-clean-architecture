import { DbSaveSurveyResult } from './db-save-survey-result';
import MockDate from 'mockdate';
import { SurveyResultModel } from '../../../../domain/models/survey-result';
import {
  SaveSurveyResult,
  SaveSurveyResultParams,
} from '../../../../domain/usecases/survey-result/save-survey-result';
import { SaveSurveyResultRepository } from '../../../protocols/db/survey/survey-result/save-survey-result-repository';
import { LoadSurveyResultRepository } from '../../../protocols/db/survey/survey-result/load-survey-result-repository';

interface SutTypes {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
}

const makeSaveSurveyResultRepositoryStub = () => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    save = async (): Promise<void> => {};
  }
  return new SaveSurveyResultRepositoryStub();
};

const makeLoadSurveyResultRepositoryStub = () => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    loadBySurveyId = async (): Promise<SurveyResultModel> =>
      mockSurveyResultModel();
  }
  return new LoadSurveyResultRepositoryStub();
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepositoryStub();
  const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepositoryStub();
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub,
  );
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub,
  };
};

const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'survey-id',
  question: 'question',
  answers: [
    {
      answer: 'answer',
      image: 'img.jpeg',
      count: 4,
      percent: 80,
    },
  ],
});

const mockSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'account-id',
  answer: 'answer',
  date: new Date(),
  surveyId: 'surveyId',
});

describe('DbAddSurvey UseCase', () => {
  beforeEach(() => {
    MockDate.set(new Date());
  });
  afterEach(() => {
    MockDate.reset();
  });

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();

    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');

    await sut.save(mockSurveyResultParams());

    expect(saveSpy).toHaveBeenCalledWith(mockSurveyResultParams());
  });

  test('Should trhows if SaveSurveyResultRepository trhows', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();

    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockImplementation(() => {
        throw new Error();
      });

    const response = sut.save(mockSurveyResultParams());

    await expect(response).rejects.toThrow();
  });

  test('Should call loadSurveyResultRepositoryStub with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();

    const loadBySurvayId = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId',
    );

    await sut.save(mockSurveyResultParams());

    expect(loadBySurvayId).toHaveBeenCalledWith(
      mockSurveyResultParams().surveyId,
    );
  });

  test('Should return a survey when called with valid data', async () => {
    const { sut } = makeSut();

    const resposne = await sut.save(mockSurveyResultParams());

    expect(resposne).toEqual(mockSurveyResultModel());
  });
});
