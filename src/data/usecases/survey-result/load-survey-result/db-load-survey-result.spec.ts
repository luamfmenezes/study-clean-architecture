import { DbLoadSurveyResult } from './db-load-survey-result';
import { LoadSurveyResultRepository } from '../../../protocols/db/survey/survey-result/load-survey-result-repository';
import { SurveyResultModel } from '../../../../domain/models/survey-result';
import { LoadSurveyByIdRepository } from '../../../protocols/db/survey/load-survey-by-id-repository';
import { SurveyModel } from '../../../../domain/models/survey';

interface sutTypes {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
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

const mockSurveyModel = (): SurveyModel => ({
  id: 'id',
  date: new Date(),
  question: 'question',
  answers: [
    {
      answer: 'answer',
      image: 'img.jpeg',
    },
  ],
});

const mockLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
  class mockoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    loadById = async (): Promise<SurveyModel> => mockSurveyModel();
  }
  return new mockoadSurveyByIdRepositoryStub();
};

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
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepositoryStub();
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub,
  );
  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub,
  };
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
  test('should call loadSurveyByIdRepository if loadSurveyResultRepository return undefined ', async () => {
    const {
      loadSurveyResultRepositoryStub,
      loadSurveyByIdRepositoryStub,
      sut,
    } = makeSut();

    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockResolvedValueOnce(undefined);

    const loadSurveyByIdSpy = jest.spyOn(
      loadSurveyByIdRepositoryStub,
      'loadById',
    );

    await sut.load('survey-id');

    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('survey-id');
  });
  test('should return survey-result with all answers counts = 0 if loadSurveyResultRepository return undefined ', async () => {
    const { loadSurveyResultRepositoryStub, sut } = makeSut();

    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockResolvedValueOnce(undefined);

    const response = await sut.load('survey-id');

    expect(response).toEqual({
      surveyId: 'id',
      question: 'question',
      answers: [
        {
          answer: 'answer',
          image: 'img.jpeg',
          count: 0,
          percent: 0,
        },
      ],
    });
  });
});
