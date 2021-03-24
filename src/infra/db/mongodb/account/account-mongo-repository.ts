import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from '../../../../data/protocols/db/account/load-account-by-token-repository';
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountParams } from '../../../../domain/usecases/account/add-account';
import MongoHelper from '../helpers/mongo-helper';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository {
  add = async (accountData: AddAccountParams): Promise<AccountModel> => {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);

    return MongoHelper.map(result.ops[0]);
  };

  loadByEmail = async (email: string): Promise<AccountModel | undefined> => {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const account = await accountCollection.findOne({ email });

    return account && MongoHelper.map(account);
  };

  loadByToken = async (
    accessToken: string,
    role?: string,
  ): Promise<AccountModel | undefined> => {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const filter = { accessToken };

    if (role) {
      Object.assign(filter, { role });
    }

    const account = await accountCollection.findOne(filter);

    return account && MongoHelper.map(account);
  };

  updateAccessToken = async (
    id: string,
    accessToken: string,
  ): Promise<void> => {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.updateOne({ _id: id }, { $set: { accessToken } });
  };
}
