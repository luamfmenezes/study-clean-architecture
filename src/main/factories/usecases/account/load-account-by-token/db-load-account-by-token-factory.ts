import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository';
import { LoadAccountByToken } from '../../../../../domain/usecases/load-account-by-token';
import { DbLoadAccountByToken } from '../../../../../data/usecases/load-account-by-token/db-load-account-by-token';
import { JwtAdatper } from '../../../../../infra/criptography/jwt-adapter/jwt-adapter';
import env from '../../../../config/env';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const accountMongoRepository = new AccountMongoRepository();
  const jwt = new JwtAdatper(env.jwtSecret);
  return new DbLoadAccountByToken(jwt, accountMongoRepository);
};
