import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository';
import { LoadSurveyByIdRepository } from '../../../../data/protocols/db/survey/load-survey-by-id-repository';
import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository';
import { SurveyModels } from '../../../../domain/models/survey';
import { AddSurveyModel } from '../../../../domain/usecases/add-survey';
import MongoHelper from '../helpers/mongo-helper';

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository {
  add = async (surveyData: AddSurveyModel): Promise<void> => {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(surveyData);
  };

  loadAll = async (): Promise<SurveyModels[]> => {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveys: SurveyModels[] = await surveyCollection.find().toArray();
    return surveys;
  };

  loadById = async (id: string): Promise<SurveyModels | undefined> => {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne({ _id: id });
    if (!survey) return undefined;
    return MongoHelper.map(survey);
  };
}
