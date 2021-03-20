/* eslint no-underscore-dangle: 0 */
import { Collection, ObjectId } from 'mongodb';
import { SurveyModel } from '../../../../../domain/models/survey';
import MongoHelper from '../../helpers/mongo-helper';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';

let surveyCollection: Collection;
let suveyResultCollection: Collection;
let accountCollection: Collection;

const makeSut = () => new SurveyResultMongoRepository();

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
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
  return MongoHelper.map(res.ops[0]);
};

const makeAccount = async (): Promise<Account> => {
  const res = await accountCollection.insertOne({
    name: 'jhondoe',
    email: 'jhondoe@mail.com',
    password: 'hashed-password',
  });
  return MongoHelper.map(res.ops[0]);
};

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || '');
  });
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
    suveyResultCollection = await MongoHelper.getCollection('surveyResults');
    await suveyResultCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  describe('save()', () => {
    it('should add a survey result if it is new', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();
      const sut = makeSut();

      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        date: new Date(),
        answer: survey.answers[0].answer,
      });

      const surveyResult = await suveyResultCollection.findOne({
        surveyId: survey.id,
        accountId: account.id,
      });

      expect(surveyResult).toBeTruthy();
    });

    it('should update a survey it already exist', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();

      await suveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      const sut = makeSut();

      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date(),
      });

      const surveyResult = await suveyResultCollection
        .find({
          surveyId: survey.id,
          accountId: account.id,
        })
        .toArray();

      expect(surveyResult).toBeTruthy();
    });
  });

  describe('loadBySurveyId()', () => {
    it('should return a survey if it already exist', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();

      await suveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(account.id),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
      ]);

      const sut = makeSut();

      const surveyResult = await sut.loadBySurveyId(`${survey.id}`);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult?.surveyId).toEqual(survey.id);
      expect(surveyResult?.answers[0].count).toBe(3);
      expect(surveyResult?.answers[0].percent).toBe(75);
      expect(surveyResult?.answers[1].count).toBe(1);
      expect(surveyResult?.answers[1].percent).toBe(25);
    });
    it('should return a survey if it already exist', async () => {
      const invalidId = '507f1f77bcf86cd799439011';

      const sut = makeSut();

      const surveyResult = await sut.loadBySurveyId(invalidId);

      expect(surveyResult).toBeFalsy();
    });
  });
});
