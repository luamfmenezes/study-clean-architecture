import { Controller } from '../../../../presentation/protocols';
import { makeSurveyValidation } from './add-survey-validation-factory';
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory';
import { AddSurveyController } from '../../../../presentation/controllers/survey/add-survey/add-survey-controller';
import { makeDbAddSurvey } from '../../usecases/add-survey/db-add-account-factory';

export const makeAddSurveyController = (): Controller => {
  const validation = makeSurveyValidation();
  const addSurvey = makeDbAddSurvey();
  const surveyController = new AddSurveyController(validation, addSurvey);
  return makeLogControllerDecorator(surveyController);
};
