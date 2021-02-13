import env from '../../config/env';
import { LoginController } from '../../../presentation/controllers/login/login-controller';
import { Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';
import { makeLoginValidation } from './login-validation-factory';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdatper } from '../../../infra/criptography/jwt-adapter/jwt-adapter';

export const makeLoginController = (): Controller => {
  const salt = 12;
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdatper(env.jwtSecret);
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
  );
  const validation = makeLoginValidation();
  const loginController = new LoginController(validation, dbAuthentication);
  const logErrorRepository = new LogMongoRepository();
  return new LogControllerDecorator(loginController, logErrorRepository);
};
