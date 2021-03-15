/* eslint no-underscore-dangle: 0 */
import { Collection } from 'mongodb';
import { AddSurveyModel } from '../../../../domain/usecases/survey/add-survey';
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
  date: new Date(),
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
  describe('add()', () => {
    it('should add a survey on success', async () => {
      const sut = makeSut();

      await sut.add(makeFakeSurvey());

      const sruvey = await surveyCollection.findOne({ question: 'question' });
      expect(sruvey).toBeTruthy();
    });
  });
  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      await surveyCollection.insertMany([makeFakeSurvey(), makeFakeSurvey()]);

      const sut = makeSut();

      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
    });
    it('should load an empty list', async () => {
      const sut = makeSut();

      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(0);
    });
  });
  describe('loadById()', () => {
    it('should return the specific survey on success', async () => {
      const resInsertSurvey = await surveyCollection.insertOne(
        makeFakeSurvey(),
      );

      const surveyId = resInsertSurvey.ops[0]._id;

      const sut = makeSut();

      const survey = await sut.loadById(surveyId);

      expect(survey).toBeTruthy();
      expect(survey?.id).toEqual(surveyId);
    });
    it('should return undefined when survey does not exist', async () => {
      const sut = makeSut();

      const survey = await sut.loadById('invalid-id');

      expect(survey).toBeUndefined();
    });
  });
});
