import { AddAccountRepository } from '../../../../data/protocols/add-account-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import MongoHelper from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
  add = async (accountData: AddAccountModel): Promise<AccountModel> => {
    const accountCollection = MongoHelper.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);

    return MongoHelper.map(result.ops[0]);
  };
}
