import { AccountModel } from '../../../../domain/models/account';

// is not used

export const map = (account: any): AccountModel => {
  const { _id, ...accountWithOutId } = account;
  return Object.assign(accountWithOutId, { id: _id });
};
