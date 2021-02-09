import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Hasher,
  AddAccountRepository,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher;

  private readonly addAccountRepository: AddAccountRepository;

  constructor(hasher: Hasher, addAccountRepository: AddAccountRepository) {
    this.hasher = hasher;
    this.addAccountRepository = addAccountRepository;
  }

  add = async (accountData: AddAccountModel): Promise<AccountModel> => {
    const { email, name, password } = accountData;

    const enctryptedPassword = await this.hasher.hash(password);

    const account = await this.addAccountRepository.add({
      name,
      email,
      password: enctryptedPassword,
    });

    return account;
  };
}
