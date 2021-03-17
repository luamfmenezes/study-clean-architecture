import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols';
import {
  AccountModel,
  AddAccount,
  AddAccountParams,
  Hasher,
  AddAccountRepository,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher;

  private readonly addAccountRepository: AddAccountRepository;

  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  constructor(
    hasher: Hasher,
    addAccountRepository: AddAccountRepository,
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {
    this.hasher = hasher;
    this.addAccountRepository = addAccountRepository;
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
  }

  add = async (
    accountData: AddAccountParams,
  ): Promise<AccountModel | undefined> => {
    const { email, name, password } = accountData;

    const userAlreadExist = await this.loadAccountByEmailRepository.loadByEmail(
      email,
    );

    if (userAlreadExist) {
      return undefined;
    }

    const enctryptedPassword = await this.hasher.hash(password);

    const account = await this.addAccountRepository.add({
      name,
      email,
      password: enctryptedPassword,
    });

    return account;
  };
}
