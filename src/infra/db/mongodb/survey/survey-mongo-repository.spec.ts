/* eslint no-underscore-dangle: 0 */
import { Collection } from 'mongodb';
import { AddSurveyModel } from '../../../../domain/usecases/add-survey';
import MongoHelper from '../helpers/mongo-helper';
import { SurveyMongoRepository } from './survey-mongo-repository';

const makeSut = () => new SurveyMongoRepository();

const makeFakeSurvey = (): AddSurveyModel => ({
  question: 'question',
  answers: [
    {
      answer: 'answer-one',
      image: 'image.png',
    },
    {
      answer: 'answer-two',
    },
  ],
});

let surveyCollection: Collection;

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || '');
  });
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  it('should add a survey on success', async () => {
    const sut = makeSut();

    await sut.add(makeFakeSurvey());

    const sruvey = await surveyCollection.findOne({ question: 'question' });
    expect(sruvey).toBeTruthy();
  });
});
