import SignUpController from '../../../../presentation/controllers/signUp/SignUp-controller';
import { Controller } from '../../../../presentation/protocols';
import { makeSignUpValidation } from './signup-validation-factory';
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory';
import { makeDbAddAccount } from '../../usecases/add-account/db-add-account-factory';
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory';

export const makeSignUpController = (): Controller => {
  const dbAddAccount = makeDbAddAccount();
  const validation = makeSignUpValidation();
  const dbAuthentication = makeDbAuthentication();
  const signupController = new SignUpController(
    dbAddAccount,
    validation,
    dbAuthentication,
  );
  return makeLogControllerDecorator(signupController);
};
