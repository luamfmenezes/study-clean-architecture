/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Hasher,
  AddAccountModel,
  AccountModel,
  AddAccountRepository,
} from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';
import { LoadAccountByEmailRepository } from '../../authentication/db-authentication-protocols';

const makeFakeAddAccount = (): AddAccountModel => ({
  email: 'jhondoe@email.com',
  name: 'jhondoe',
  password: 'password',
});

const makeFakeAccount = (): AccountModel => ({
  id: 'valid-id',
  ...makeFakeAddAccount(),
});

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    hash = async (): Promise<string> => 'hashed_password';
  }
  return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub {
    add = async (account: AddAccountModel): Promise<AccountModel> =>
      makeFakeAccount();
  }
  return new AddAccountRepositoryStub();
};

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    loadByEmail = async (): Promise<AccountModel | undefined> => undefined;
  }
  return new LoadAccountByEmailRepositoryStub();
};

interface SutTypes {
  hasherStub: Hasher;
  sut: DbAddAccount;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  addAccountRepository: AddAccountRepository;
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub();
  const addAccountRepository = makeAddAccountRepository();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub();
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepository,
    loadAccountByEmailRepositoryStub,
  );
  return {
    sut,
    hasherStub,
    addAccountRepository,
    loadAccountByEmailRepositoryStub,
  };
};

describe('DbAddAccount Usecase', () => {
  test('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hasherSpy = jest.spyOn(hasherStub, 'hash');
    await sut.add(makeFakeAddAccount());
    expect(hasherSpy).toHaveBeenCalledWith('password');
  });
  test('should throw Error if Hasher trhow Error', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockImplementation(() => {
      throw new Error('Hash Error');
    });

    const promiseAdd = sut.add(makeFakeAddAccount());
    await expect(promiseAdd).rejects.toThrow();
  });

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepository } = makeSut();
    const addSpy = jest.spyOn(addAccountRepository, 'add');

    await sut.add(makeFakeAddAccount());
    expect(addSpy).toHaveBeenCalledWith({
      ...makeFakeAddAccount(),
      password: 'hashed_password',
    });
  });

  test('should throw Error if AddAccountRepository trhow Error', async () => {
    const { sut, addAccountRepository } = makeSut();
    jest.spyOn(addAccountRepository, 'add').mockImplementation(() => {
      throw new Error('AddAccountRepository Error');
    });
    const promiseAdd = sut.add(makeFakeAddAccount());
    await expect(promiseAdd).rejects.toThrow();
  });

  test('should return created account when called with correct values', async () => {
    const { sut } = makeSut();

    const createdAccount = await sut.add(makeFakeAddAccount());

    expect(createdAccount).toEqual({
      ...makeFakeAddAccount(),
      id: 'valid-id',
    });
  });

  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadAccountSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail',
    );

    await sut.add(makeFakeAddAccount());

    expect(loadAccountSpy).toHaveBeenCalledWith(makeFakeAddAccount().email);
  });

  test('should return undefined when email already exist', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockResolvedValueOnce({
        ...makeFakeAddAccount(),
        id: 'valid-id',
      });

    const response = await sut.add(makeFakeAddAccount());

    expect(response).toBeUndefined();
  });
});
