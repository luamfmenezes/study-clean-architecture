import { LoadSurveyById } from '../../../../domain/usecases/survey/load-surveys-by-id';
import { forbidden, serverError, ok } from '../../../helpers/http/http-helper';
import { InvalidParamError } from '../../../errors';
import { Controller, HttpRequest, HttpResponse } from '../../../protocols';
import { LoadSurveyResult } from '../../../../domain/usecases/survey-result/load-survey-result';

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult,
  ) {}

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const { surveyId } = httpRequest.params;

      const survey = await this.loadSurveyById.loadById(surveyId);

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const surveyResult = await this.loadSurveyResult.load(surveyId);

      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  };
}
