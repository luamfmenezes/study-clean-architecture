import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository';
import { LoadSurveyByIdRepository } from '../../../../data/protocols/db/survey/load-survey-by-id-repository';
import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository';
import { SurveyModel } from '../../../../domain/models/survey';
import { AddSurveyParams } from '../../../../domain/usecases/survey/add-survey';
import MongoHelper from '../helpers/mongo-helper';

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository {
  add = async (surveyData: AddSurveyParams): Promise<void> => {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(surveyData);
  };

  loadAll = async (): Promise<SurveyModel[]> => {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveys: SurveyModel[] = await surveyCollection.find().toArray();
    return MongoHelper.mapCollection(surveys);
  };

  loadById = async (id: string): Promise<SurveyModel | undefined> => {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne({ _id: id });
    if (!survey) return undefined;
    return MongoHelper.map(survey);
  };
}
