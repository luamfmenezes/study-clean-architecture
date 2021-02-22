import { Router } from 'express';
import { adatperRoute } from '../adapters/express/express-route-adapter';
import { makeSignUpController } from '../factories/controllers/login/signup/signup-controller-factory';
import { makeLoginController } from '../factories/controllers/login/login/login-controller-factory';

export default (router: Router): void => {
  router.post('/signup', adatperRoute(makeSignUpController()));
  router.post('/login', adatperRoute(makeLoginController()));
};
