import { SurveyResultModel } from '../../../../domain/models/survey-result';
import { LoadSurveyResult } from '../../../../domain/usecases/survey-result/load-survey-result';
import { LoadSurveyResultRepository } from '../../../protocols/db/survey/survey-result/load-survey-result-repository';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}

  public load = async (
    surveyId: string,
  ): Promise<SurveyResultModel | undefined> => {
    const surveyRepository = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId,
    );
    return surveyRepository;
  };
}
