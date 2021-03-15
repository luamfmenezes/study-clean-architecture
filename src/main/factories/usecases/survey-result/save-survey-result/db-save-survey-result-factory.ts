import { SurveyResultMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-result/survey-result-mongo-repository';
import { SaveSurveyResult } from '../../../../../domain/usecases/survey-result/save-survey-result';
import { DbSaveSurveyResult } from '../../../../../data/usecases/save-survey-result/db-save-survey-result';

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const saveSurveyResultRepository = new SurveyResultMongoRepository();
  return new DbSaveSurveyResult(saveSurveyResultRepository);
};
