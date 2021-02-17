import { DbAddSurvey } from './db-add-survey';
import {
  AddSurvey,
  AddSurveyModel,
  AddSurveyRepository,
} from './db-add-survey-protocols';

interface SutTypes {
  sut: AddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
}

const makeAddSurveyRepository = () => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    add = async (): Promise<void> => {};
  }
  return new AddSurveyRepositoryStub();
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return { sut, addSurveyRepositoryStub };
};

const makeFakeAddSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      image: 'any_image',
    },
  ],
});

describe('DbAddSurvey UseCase', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();

    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');

    await sut.add(makeFakeAddSurvey());

    expect(addSpy).toHaveBeenCalledWith(makeFakeAddSurvey());
  });
  test('Should throws when AddSurvayRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();

    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementation(() => {
      throw new Error();
    });

    const response = sut.add(makeFakeAddSurvey());

    expect(response).rejects.toThrow();
  });
});
