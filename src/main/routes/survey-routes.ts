import { Router } from 'express';
import { adaptMiddleware } from '../adapters/express/express-middleware-adapter';
import { adatperRoute } from '../adapters/express/express-route-adapter';
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory';
import { makeAuthMiddleware } from '../factories/middlewares/auth-middlewares-factory';

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));
  router.post('/surveys', adminAuth, adatperRoute(makeAddSurveyController()));
};
