import { Controller } from '../../../../../presentation/protocols';
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory';
import { makeDbSaveSurveyResult } from '../../../usecases/survey-result/save-survey-result/db-save-survey-result-factory';
import { SaveSurveyResultController } from '../../../../../presentation/controllers/survey/survey-result/save-survey-result/save-survey-result-controller';
import { makeDbLoadSurveyById } from '../../../usecases/survey/load-survey-by-id/db-load-survey-by-id-factory';

export const makeSaveSurveyResultController = (): Controller => {
  const saveSurveyResult = makeDbSaveSurveyResult();
  const loadSurveyById = makeDbLoadSurveyById();
  const saveSurveyResultController = new SaveSurveyResultController(
    loadSurveyById,
    saveSurveyResult,
  );
  return makeLogControllerDecorator(saveSurveyResultController);
};
