import { DbLoadAccountByToken } from './db-load-account-by-token';
import { Decrypter } from '../../protocols/cryptograph/decrypter';
import { AccountModel } from '../../../domain/models/account';
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository';

const makeFakeAccountModel = (): AccountModel => ({
  id: 'valid-id',
  email: 'jhondoe@mail.com',
  name: 'jhondoe',
  password: 'password',
});

const makeDecripterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decrypt = async (): Promise<string> => 'decrypted_token';
  }
  return new DecrypterStub();
};
const makeLoadAccountByTokenRepositoryStub = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository {
    loadByToken = async (): Promise<AccountModel> => makeFakeAccountModel();
  }
  return new LoadAccountByTokenRepositoryStub();
};

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepositoryStub();
  const decrypterStub = makeDecripterStub();
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  );
  return { sut, decrypterStub, loadAccountByTokenRepositoryStub };
};

describe('DbLoadAccountByToken UseCase', () => {
  test('Should call Decripter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();
    const decripterSpy = jest.spyOn(decrypterStub, 'decrypt');
    await sut.load('token', 'role');
    expect(decripterSpy).toHaveBeenCalledWith('token');
  });
  test('Should return undefined if decrypt return undefined', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValue(undefined);
    const response = await sut.load('token', 'role');
    expect(response).toBeUndefined();
  });
  test('Should trhows decript throws', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => {
      throw new Error();
    });
    const response = sut.load('token', 'role');
    expect(response).rejects.toThrow();
  });
  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken');
    await sut.load('token', 'role');
    expect(loadSpy).toHaveBeenCalledWith('token', 'role');
  });
  test('Should return undefined if decrypt return undefined', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockResolvedValue(undefined);

    const response = await sut.load('token', 'role');

    expect(response).toBeUndefined();
  });
  test('Should trhows LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const response = sut.load('token', 'role');
    expect(response).rejects.toThrow();
  });
  test('Should return an Account whe provided with valid data', async () => {
    const { sut } = makeSut();

    const response = await sut.load('token', 'role');

    expect(response).toEqual(makeFakeAccountModel());
  });
});
