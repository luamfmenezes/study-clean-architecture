/* eslint no-underscore-dangle: 0 */
import { Collection } from 'mongodb';
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
  it('should add a survey result if it is new', async () => {
    const survey = await makeSurvey();
    const account = await makeAccount();
    const sut = makeSut();

    const surveyResult = await sut.save({
      surveyId: survey.id,
      accountId: account.id,
      date: new Date(),
      answer: survey.answers[0].answer,
    });

    expect(surveyResult).toBeTruthy();
    expect(surveyResult.id).toBeTruthy();
    expect(surveyResult.answer).toBe(survey.answers[0].answer);
  });

  it('should update a survey it already exist', async () => {
    const survey = await makeSurvey();
    const account = await makeAccount();

    const res = await suveyResultCollection.insertOne({
      surveyId: survey.id,
      accountId: account.id,
      answer: survey.answers[0].answer,
      date: new Date(),
    });

    const sut = makeSut();

    const surveyResult = await sut.save({
      surveyId: survey.id,
      accountId: account.id,
      answer: survey.answers[1].answer,
      date: new Date(),
    });

    expect(surveyResult).toBeTruthy();
    expect(surveyResult.id).toEqual(res.ops[0]._id);
    expect(surveyResult.answer).toBe(survey.answers[1].answer);
  });
});
