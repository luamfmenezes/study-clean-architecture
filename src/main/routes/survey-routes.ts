import { Router } from 'express';
import { adatperRoute } from '../adapters/express/express-route-adapter';
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory';
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-controller-factory';
import { adminAuth } from '../middlewares/admin-auth';
import { auth } from '../middlewares/auth';

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adatperRoute(makeLoadSurveysController()));
  router.get('/surveys', auth, adatperRoute(makeAddSurveyController()));
};
