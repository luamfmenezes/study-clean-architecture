import { SurveyResultModel } from '../../../../domain/models/survey-result';
import {
  SaveSurveyResult,
  SaveSurveyResultParams,
} from '../../../../domain/usecases/survey-result/save-survey-result';
import { LoadSurveyResultRepository } from '../../../protocols/db/survey/survey-result/load-survey-result-repository';
import { SaveSurveyResultRepository } from '../../../protocols/db/survey/survey-result/save-survey-result-repository';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}
  save = async (
    surveyData: SaveSurveyResultParams,
  ): Promise<SurveyResultModel | undefined> => {
    await this.saveSurveyResultRepository.save(surveyData);

    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyData.surveyId,
    );

    return surveyResult;
  };
}
