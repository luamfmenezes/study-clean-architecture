import { Router } from 'express';
import { adatperRoute } from '../adapters/express/express-route-adapter';
import { makeSignUpController } from '../factories/signup/signup-factory';
import { makeLoginController } from '../factories/login/login-factory';

export default (router: Router): void => {
  router.post('/signup', adatperRoute(makeSignUpController()));
  router.post('/login', adatperRoute(makeLoginController()));
};
