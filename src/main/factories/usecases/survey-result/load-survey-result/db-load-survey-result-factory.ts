import { SurveyResultMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-result/survey-result-mongo-repository';
import { LoadSurveyResult } from '../../../../../domain/usecases/survey-result/load-survey-result';
import { DbLoadSurveyResult } from '../../../../../data/usecases/survey-result/load-survey-result/db-load-survey-result';
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository';

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const loadSurveyResultRepository = new SurveyResultMongoRepository();
  const loadSurveyByIdRepository = new SurveyMongoRepository();
  return new DbLoadSurveyResult(
    loadSurveyResultRepository,
    loadSurveyByIdRepository,
  );
};
