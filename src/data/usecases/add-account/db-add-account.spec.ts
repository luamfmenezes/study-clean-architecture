/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Encrypter,
  AddAccountModel,
  AccountModel,
  AddAccountRepository,
} from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';

const makeEncrypt = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    encrypt = async (): Promise<string> => 'hashed_password';
  }
  return new EncrypterStub();
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
  encryptStub: Encrypter;
  sut: DbAddAccount;
  addAccountRepository: any;
}

const makeSut = (): SutTypes => {
  const encryptStub = makeEncrypt();
  const addAccountRepository = makeAddAccountRepository();
  const sut = new DbAddAccount(encryptStub, addAccountRepository);
  return {
    sut,
    encryptStub,
    addAccountRepository,
  };
};

describe('DbAddAccount Usecase', () => {
  test('should call Encrypter with correct password', async () => {
    const { sut, encryptStub } = makeSut();
    const encryptSpy = jest.spyOn(encryptStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });
  test('should throw Error if Encrypter trhow Error', async () => {
    const { sut, encryptStub } = makeSut();
    jest.spyOn(encryptStub, 'encrypt').mockImplementation(() => {
      throw new Error('Encrypt Error');
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
