import { DbSaveSurveyResult } from './db-save-survey-result';
import MockDate from 'mockdate';
import { SurveyResultModel } from '../../../../domain/models/survey-result';
import { SaveSurveyResultModel } from '../../../../domain/usecases/survey-result/save-survey-result';
import { SaveSurveyResultRepository } from '../../../protocols/db/survey/survey-result/save-survey-result-repository';

interface SutTypes {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
}

const makeSaveSurveyResultRepositoryStub = () => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    save = async (data: SaveSurveyResultModel): Promise<SurveyResultModel> =>
      makeFakeSurveyResult();
  }
  return new SaveSurveyResultRepositoryStub();
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepositoryStub();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);
  return { sut, saveSurveyResultRepositoryStub };
};

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
  accountId: 'account-id',
  answer: 'answer',
  date: new Date(),
  surveyId: 'survey-id',
});

const makeFakeSurveyResult = (): SurveyResultModel => ({
  ...makeFakeSurveyResultData(),
  id: 'valid-id',
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

    await sut.save(makeFakeSurveyResultData());

    expect(saveSpy).toHaveBeenCalledWith(makeFakeSurveyResultData());
  });

  test('Should trhows if SaveSurveyResultRepository trhows', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();

    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockImplementation(() => {
        throw new Error();
      });

    const response = sut.save(makeFakeSurveyResultData());

    await expect(response).rejects.toThrow();
  });

  test('Should return a survey when called with valid data', async () => {
    const { sut } = makeSut();

    const resposne = await sut.save(makeFakeSurveyResultData());

    expect(resposne).toEqual(makeFakeSurveyResult());
  });
});
