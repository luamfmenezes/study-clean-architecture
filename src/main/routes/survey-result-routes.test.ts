/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

import request from 'supertest';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import app from '../config/app';
import MongoHelper from '../../infra/db/mongodb/helpers/mongo-helper';
import env from '../config/env';

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

  describe('POST /surveys/:surveysId/result', () => {
    test('should return 403 on /surveys/result when not provided with token', async () => {
      await request(app)
        .put('/api/surveys/survey_id/results')
        .send({ answer: 'answer' })
        .expect(403);
    });
  });
});
