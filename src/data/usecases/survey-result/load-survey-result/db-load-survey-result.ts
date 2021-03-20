import { SurveyResultModel } from '../../../../domain/models/survey-result';
import { LoadSurveyResult } from '../../../../domain/usecases/survey-result/load-survey-result';
import { LoadSurveyByIdRepository } from '../../../protocols/db/survey/load-survey-by-id-repository';
import { LoadSurveyResultRepository } from '../../../protocols/db/survey/survey-result/load-survey-result-repository';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}

  public load = async (
    surveyId: string,
  ): Promise<SurveyResultModel | undefined> => {
    let surveyResult:
      | SurveyResultModel
      | undefined = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId,
    );

    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId);

      if (!survey) {
        return undefined;
      }

      surveyResult = {
        surveyId: survey.id,
        question: survey.question,
        answers: survey?.answers.map(answer => ({
          ...answer,
          count: 0,
          percent: 0,
        })),
      };
    }

    return surveyResult;
  };
}
