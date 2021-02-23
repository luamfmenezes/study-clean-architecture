/* eslint no-underscore-dangle: 0 */
import { Collection } from 'mongodb';
import MongoHelper from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-repository';

const makeSut = () => new AccountMongoRepository();

const makeFakeUser = () => ({
  name: 'jhondoe',
  email: 'jhondoe@email.com',
  password: 'password',
});

const makeFakeUserWithToken = () => ({
  ...makeFakeUser(),
  accessToken: 'token',
});

let accountCollection: Collection;

describe('Account Mongo Repository', () => {
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
  describe('add()', () => {
    it('should return an account on add success', async () => {
      const sut = makeSut();

      const account = await sut.add(makeFakeUser());

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('jhondoe');
      expect(account.email).toBe('jhondoe@email.com');
      expect(account.password).toBe('password');
    });
  });
  describe('loadByEmail()', () => {
    it('should return an account on loadByEmail success', async () => {
      const sut = makeSut();

      await accountCollection.insertOne(makeFakeUser());

      const account = await sut.loadByEmail('jhondoe@email.com');

      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe('jhondoe');
      expect(account?.email).toBe('jhondoe@email.com');
    });
    it('should return undefined account if loadByEmail fails', async () => {
      const sut = makeSut();

      const account = await sut.loadByEmail('jhondoe@email.com');

      expect(account).toBeFalsy();
    });
  });
  describe('updateAccessToken()', () => {
    it('should update accessToken on updateAccessToken success', async () => {
      const sut = makeSut();

      const res = await accountCollection.insertOne(makeFakeUser());

      const user = res.ops[0];

      expect(user.accessToken).toBeFalsy();

      await sut.updateAccessToken(user._id, 'any_token');

      const account = await accountCollection.findOne({ _id: user._id });

      expect(account).toBeTruthy();
      expect(account.accessToken).toBe('any_token');
    });
  });
  describe('loadByToken()', () => {
    it('should return an account on loadByToken with role', async () => {
      const sut = makeSut();

      await accountCollection.insertOne({
        ...makeFakeUserWithToken(),
        role: 'role',
      });

      const account = await sut.loadByToken('token', 'role');

      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe('jhondoe');
      expect(account?.email).toBe('jhondoe@email.com');
    });
    it('should return undefined account if loadByToken fails', async () => {
      const sut = makeSut();

      const account = await sut.loadByEmail('jhondoe@email.com');

      expect(account).toBeFalsy();
    });
  });
});
