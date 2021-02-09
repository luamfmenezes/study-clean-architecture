/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Hasher,
  AddAccountModel,
  AccountModel,
  AddAccountRepository,
} from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    hash = async (): Promise<string> => 'hashed_password';
  }
  return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub {
    add = async (account: AddAccountModel): Promise<AccountModel> => ({
      ...account,
      id: 'valid-id',
    });
  }
  return new AddAccountRepositoryStub();
};

interface SutTypes {
  hasherStub: Hasher;
  sut: DbAddAccount;
  addAccountRepository: any;
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub();
  const addAccountRepository = makeAddAccountRepository();
  const sut = new DbAddAccount(hasherStub, addAccountRepository);
  return {
    sut,
    hasherStub,
    addAccountRepository,
  };
};

describe('DbAddAccount Usecase', () => {
  test('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hasherSpy = jest.spyOn(hasherStub, 'hash');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    sut.add(accountData);
    expect(hasherSpy).toHaveBeenCalledWith('valid_password');
  });
  test('should throw Error if Hasher trhow Error', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockImplementation(() => {
      throw new Error('Hash Error');
    });
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    const promiseAdd = sut.add(accountData);
    await expect(promiseAdd).rejects.toThrow();
  });

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepository } = makeSut();
    const addSpy = jest.spyOn(addAccountRepository, 'add');

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
    });
  });

  test('should throw Error if AddAccountRepository trhow Error', async () => {
    const { sut, addAccountRepository } = makeSut();
    jest.spyOn(addAccountRepository, 'add').mockImplementation(() => {
      throw new Error('AddAccountRepository Error');
    });
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    const promiseAdd = sut.add(accountData);
    await expect(promiseAdd).rejects.toThrow();
  });

  test('should return created account when called with correct values', async () => {
    const { sut } = makeSut();

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    const createdAccount = await sut.add(accountData);
    expect(createdAccount).toEqual({
      id: 'valid-id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
    });
  });
});
