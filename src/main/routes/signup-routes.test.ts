import request from 'supertest';
import app from '../config/app';
import MongoHelper from '../../infra/db/mongodb/helpers/mongo-helper';

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || '');
  });
  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('account');
    await accountCollection.deleteMany({});
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('should return an account on success', async () => {
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
