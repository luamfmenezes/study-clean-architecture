import { AddSurvey } from '../../../../../domain/usecases/survey/add-survey';
import { DbAddSurvey } from '../../../../../data/usecases/survey/add-survey/db-add-survey';
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository';

export const makeDbAddSurvey = (): AddSurvey => {
  const addSurveyMongoRepository = new SurveyMongoRepository();
  return new DbAddSurvey(addSurveyMongoRepository);
};
