import { SaveSurveyResultController } from './save-survey-result-controller';
import { forbidden } from '../../../../helpers/http/http-helper';
import { HttpRequest } from '../../add-survey/add-survey-controller-protocols';
import { LoadSurveyById } from '../../../../../domain/usecases/survey/load-surveys-by-id';
import { SurveyModels } from '../../../../../domain/models/survey';
import { InvalidParamError } from '../../../../errors';

interface SutTypes {
  sut: SaveSurveyResultController;
  loadSurveyById: LoadSurveyById;
}

const makeFakeSurvey = (): SurveyModels => ({
  id: 'valid-id',
  question: 'question',
  answers: [
    { answer: 'answer1', image: 'image1.png' },
    { answer: 'answer2', image: 'image2.png' },
  ],
  date: new Date(),
});

const makeLoadSurveyById = (): LoadSurveyById => {
  class DbLoadSurveyByIdStub implements LoadSurveyById {
    loadById = async (): Promise<SurveyModels | undefined> => makeFakeSurvey();
  }
  return new DbLoadSurveyByIdStub();
};

const makeSut = (): SutTypes => {
  const loadSurveyById = makeLoadSurveyById();
  const sut = new SaveSurveyResultController(loadSurveyById);
  return { sut, loadSurveyById };
};

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'survey-id',
  },
});

describe('SaveSurveyResult Controller', () => {
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
});
