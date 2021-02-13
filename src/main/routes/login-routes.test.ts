import request from 'supertest';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';
import app from '../config/app';
import MongoHelper from '../../infra/db/mongodb/helpers/mongo-helper';

let accountCollection: Collection;

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || '');
  });
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('POST /signUp', () => {
    test('should return 200 on SignUp', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'jhondoe',
          email: 'jhondoe@email.com',
          password: 'password',
          passwordConfirmation: 'password',
        })
        .expect(200);
    });
  });

  describe('POST /login', () => {
    test('should return 200 on login', async () => {
      const password = await hash('password', 12);

      await accountCollection.insertOne({
        name: 'jhondoe',
        email: 'jhondoe@email.com',
        password,
      });

      await request(app)
        .post('/api/login')
        .send({
          email: 'jhondoe@email.com',
          password: 'password',
        })
        .expect(200);
    });
  });
  describe('POST /login', () => {
    test('should return 401 on login when provided with invalid user', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'jhondoe@email.com',
          password: 'password',
        })
        .expect(401);
    });
  });
});
