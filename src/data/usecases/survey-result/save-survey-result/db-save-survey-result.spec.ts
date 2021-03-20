import { DbSaveSurveyResult } from './db-save-survey-result';
import MockDate from 'mockdate';
import { SurveyResultModel } from '../../../../domain/models/survey-result';
import {
  SaveSurveyResult,
  SaveSurveyResultParams,
} from '../../../../domain/usecases/survey-result/save-survey-result';
import { SaveSurveyResultRepository } from '../../../protocols/db/survey/survey-result/save-survey-result-repository';

interface SutTypes {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
}

const makeSaveSurveyResultRepositoryStub = () => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    save = async (data: SaveSurveyResultParams): Promise<SurveyResultModel> =>
      mockSurveyResultModel();
  }
  return new SaveSurveyResultRepositoryStub();
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepositoryStub();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);
  return { sut, saveSurveyResultRepositoryStub };
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

  test('Should return a survey when called with valid data', async () => {
    const { sut } = makeSut();

    const resposne = await sut.save(mockSurveyResultParams());

    expect(resposne).toEqual(mockSurveyResultModel());
  });
});
