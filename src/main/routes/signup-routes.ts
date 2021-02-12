import { Router } from 'express';
import { makeSignUpController } from '../factories/signup/signup-factory';
import { adatperRoute } from '../adapters/express-route-adapter';

export default (router: Router): void => {
  router.post('/signup', adatperRoute(makeSignUpController()));
};
