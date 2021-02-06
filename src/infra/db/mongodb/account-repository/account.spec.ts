import MongoHelper from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

const makeSut = () => new AccountMongoRepository();

describe('Account Mongo Repository', () => {
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
  it('should return an account on success', async () => {
    const sut = makeSut();

    const account = await sut.add({
      name: 'jhondoe',
      email: 'jhondoe@email.com',
      password: 'password',
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('jhondoe');
    expect(account.email).toBe('jhondoe@email.com');
    expect(account.password).toBe('password');
  });
});
