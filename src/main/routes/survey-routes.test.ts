import request from 'supertest';
import { Collection } from 'mongodb';
import app from '../config/app';
import MongoHelper from '../../infra/db/mongodb/helpers/mongo-helper';
import { AddSurveyModel } from '../../domain/usecases/add-survey';

const makeFakeAddSurvey = (): AddSurveyModel => ({
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

describe('Survey Routes', () => {
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

  describe('POST /surveys', () => {
    test('should return 200 on SignUp', async () => {
      await request(app)
        .post('/api/surveys')
        .send(makeFakeAddSurvey())
        .expect(204);
    });
  });
});
