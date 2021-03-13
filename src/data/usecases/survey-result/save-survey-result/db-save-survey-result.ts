import { SurveyResultModel } from '../../../../domain/models/survey-result';
import {
  SaveSurveyResult,
  SaveSurveyResultModel,
} from '../../../../domain/usecases/survey-result/save-survey-result';
import { SaveSurveyResultRepository } from '../../../protocols/db/survey/survey-result/save-survey-result-repository';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
  ) {}
  save = async (
    surveyData: SaveSurveyResultModel,
  ): Promise<SurveyResultModel> => {
    const surveyResult = await this.saveSurveyResultRepository.save(surveyData);
    return surveyResult;
  };
}
