import { SaveSurveyResultRepository } from '../../../../../data/protocols/db/survey/save-survey-result-repository';
import { SurveyResultModel } from '../../../../../domain/models/survey-result';
import { SaveSurveyResultModel } from '../../../../../domain/usecases/save-survey-result';
import MongoHelper from '../../helpers/mongo-helper';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  save = async (
    surveyData: SaveSurveyResultModel,
  ): Promise<SurveyResultModel> => {
    const surveyResultCollection = await MongoHelper.getCollection(
      'surveyResults',
    );

    console.log({
      surveyId: surveyData.surveyId,
      accountId: surveyData.accountId,
    });

    const res = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: surveyData.surveyId,
        accountId: surveyData.accountId,
      },
      {
        $set: {
          date: surveyData.date,
          answer: surveyData.answer,
        },
      },
      {
        upsert: true,
        returnOriginal: false,
      },
    );

    return MongoHelper.map(res.value);
  };
}
