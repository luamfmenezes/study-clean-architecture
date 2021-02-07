import SignUpController from '../../presentation/controllers/signUp/SignUp';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log';
import { Controller } from '../../presentation/protocols';
import { LogControllerDecorator } from '../decorators/log-controller';
import { makeSignUpValidation } from './signup-validation';

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const logMongoRepository = new LogMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const validation = makeSignUpValidation();
  const signUpController = new SignUpController(dbAddAccount, validation);
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
