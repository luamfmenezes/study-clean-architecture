import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Encrypter,
  AddAccountRepository,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  private readonly enctrypter: Encrypter;

  private readonly addAccountRepository: AddAccountRepository;

  constructor(
    encrypter: Encrypter,
    addAccountRepository: AddAccountRepository,
  ) {
    this.enctrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  add = async (accountData: AddAccountModel): Promise<AccountModel> => {
    const { email, name, password } = accountData;

    const enctryptedPassword = await this.enctrypter.encrypt(password);

    const account = await this.addAccountRepository.add({
      name,
      email,
      password: enctryptedPassword,
    });

    return account;
  };
}
