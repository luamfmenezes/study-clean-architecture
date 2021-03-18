import { AccountModel } from '../models/account';
import { AddAccountParams } from '../usecases/account/add-account';

export const mockAccount = (): AccountModel => ({
  id: 'valid-id',
  password: 'hashedPassword',
  name: 'jhondoe',
  email: 'jhondoe@email.com',
});

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'jhondoe',
  email: 'jhondoe@email.com',
  password: 'password',
});
