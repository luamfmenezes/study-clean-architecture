import { Router } from 'express';
import { adatperRoute } from '../adapters/express/express-route-adapter';
import { makeLoadSurveyResultController } from '../factories/controllers/sruvey-result/load-survey-result/load-survey-result-controller-factory';
import { makeSaveSurveyResultController } from '../factories/controllers/sruvey-result/save-survey-result/save-survey-result-controller-factory';
import { auth } from '../middlewares/auth';

export default (router: Router): void => {
  router.put(
    '/surveys/:surveyId/results',
    auth,
    adatperRoute(makeSaveSurveyResultController()),
  );
  router.get(
    '/surveys/:surveyId/results',
    auth,
    adatperRoute(makeLoadSurveyResultController()),
  );
};
