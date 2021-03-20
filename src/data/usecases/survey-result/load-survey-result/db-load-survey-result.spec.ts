import { DbLoadSurveyResult } from './db-load-survey-result';
import { LoadSurveyResultRepository } from '../../../protocols/db/survey/survey-result/load-survey-result-repository';
import { SurveyResultModel } from '../../../../domain/models/survey-result';

interface sutTypes {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
}

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

const mockLoadSurveyResultRepositoryStub = (): LoadSurveyResultRepository => {
  class mockLoadSurveyResultRepositoryStub
    implements LoadSurveyResultRepository {
    loadBySurveyId = async (): Promise<SurveyResultModel> =>
      mockSurveyResultModel();
  }
  return new mockLoadSurveyResultRepositoryStub();
};

const makeSut = (): sutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepositoryStub();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);
  return { sut, loadSurveyResultRepositoryStub };
};

describe('DbLoadSurveyResult UseCase', () => {
  test('should call loadSurveyResultRepository with valid data', async () => {
    const { loadSurveyResultRepositoryStub, sut } = makeSut();

    const loadSurveyResultSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId',
    );

    await sut.load('survey-id');

    expect(loadSurveyResultSpy).toHaveBeenCalledWith('survey-id');
  });
  test('should trhows if loadSurveyResultRepository throws', async () => {
    const { loadSurveyResultRepositoryStub, sut } = makeSut();

    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const response = sut.load('survey-id');

    expect(response).rejects.toThrow();
  });
  test('should return survey-result when provided with valid data', async () => {
    const { sut } = makeSut();

    const response = await sut.load('survey-id');

    expect(response).toEqual(mockSurveyResultModel());
  });
});
