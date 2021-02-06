import SignUpController from '../../presentation/controllers/signUp/SignUp';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';

export const makeSignUpController = (): SignUpController => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount,
  );
  return signUpController;
};
