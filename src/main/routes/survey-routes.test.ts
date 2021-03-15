/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

import request from 'supertest';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import app from '../config/app';
import MongoHelper from '../../infra/db/mongodb/helpers/mongo-helper';
import { AddSurveyModel } from '../../domain/usecases/survey/add-survey';
import env from '../config/env';

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
  date: new Date(),
});

const makeFakeAccount = () => ({
  name: 'jhondoe',
  email: 'jhondoe@mail.com',
  password: 'password',
});

let surveyCollection: Collection;
let accountCollection: Collection;

const makeUserToken = async (role?: string): Promise<string> => {
  const user = await accountCollection.insertOne(makeFakeAccount());
  const id = user.ops[0]._id;
  const accessToken = sign({ id }, env.jwtSecret);

  const $set = { accessToken };

  if (role) {
    Object.assign($set, { role });
  }

  await accountCollection.updateOne(
    { _id: id },
    { $set: { accessToken, role: 'admin' } },
  );
  return accessToken;
};

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || '');
  });
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
    await surveyCollection.deleteMany({});
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('POST /surveys', () => {
    test('should return 403 on /surveys when not provided with token', async () => {
      await request(app)
        .post('/api/surveys')
        .send(makeFakeAddSurvey())
        .expect(403);
    });
    test('should return 200 on /surveys when provided with token', async () => {
      const accessToken = await makeUserToken('admin');

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(makeFakeAddSurvey())
        .expect(204);
    });
  });
  describe('GET /surveys', () => {
    test('should return 403 on /survey when it is not provided with token', async () => {
      await request(app)
        .get('/api/surveys')
        .send(makeFakeAddSurvey())
        .expect(403);
    });
  });

  test('should return 204 on SignUp when provided with token, when list is empty', async () => {
    const accessToken = await makeUserToken();
    await request(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
      .send(makeFakeAddSurvey())
      .expect(204);
  });

  test('should return 200 on SignUp when provided with token', async () => {
    const accessToken = await makeUserToken();

    await surveyCollection.insertOne(makeFakeAddSurvey());

    await request(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
      .send(makeFakeAddSurvey())
      .expect(200);
  });
});
