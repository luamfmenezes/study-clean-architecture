import { LoginController } from '../../../../presentation/controllers/login/login/login-controller';
import { Controller } from '../../../../presentation/protocols';
import { makeLoginValidation } from './login-validation-factory';
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory';
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory';

export const makeLoginController = (): Controller => {
  const dbAuthentication = makeDbAuthentication();
  const validation = makeLoginValidation();
  const loginController = new LoginController(validation, dbAuthentication);
  return makeLogControllerDecorator(loginController);
};
