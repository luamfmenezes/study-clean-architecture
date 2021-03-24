import { Controller } from '../../../../../presentation/protocols';
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory';
import { makeDbLoadSurveyById } from '../../../usecases/survey/load-survey-by-id/db-load-survey-by-id-factory';
import { LoadSurveyResultController } from '../../../../../presentation/controllers/survey-result/load-survey-result/load-survey-result-controller';
import { makeDbLoadSurveyResult } from '../../../usecases/survey-result/load-survey-result/db-load-survey-result-factory';

export const makeLoadSurveyResultController = (): Controller => {
  const loadSurveyResult = makeDbLoadSurveyResult();
  const loadSurveyById = makeDbLoadSurveyById();
  const loadSurveyResultController = new LoadSurveyResultController(
    loadSurveyById,
    loadSurveyResult,
  );
  return makeLogControllerDecorator(loadSurveyResultController);
};
