import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository';
import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository';
import { SurveyModels } from '../../../../domain/models/survey';
import { AddSurveyModel } from '../../../../domain/usecases/add-survey';
import MongoHelper from '../helpers/mongo-helper';

export class SurveyMongoRepository
  implements AddSurveyRepository, LoadSurveysRepository {
  add = async (surveyData: AddSurveyModel): Promise<void> => {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(surveyData);
  };

  loadAll = async (): Promise<SurveyModels[]> => {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveys: SurveyModels[] = await surveyCollection.find().toArray();
    return surveys;
  };
}
