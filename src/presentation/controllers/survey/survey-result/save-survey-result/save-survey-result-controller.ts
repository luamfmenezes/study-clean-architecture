import { SaveSurveyResult } from '../../../../../domain/usecases/survey-result/save-survey-result';
import { LoadSurveyById } from '../../../../../domain/usecases/survey/load-surveys-by-id';
import { InvalidParamError } from '../../../../errors';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../add-survey/add-survey-controller-protocols';
import {
  forbidden,
  ok,
  serverError,
} from '../../load-surveys/load-surveys-controller-protocols';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult,
  ) {}

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const { accountId = '' } = httpRequest;
      const { answer } = httpRequest.body;
      const { surveyId } = httpRequest.params;

      const survey = await this.loadSurveyById.loadById(surveyId);

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const surveyAvailableAnswers = survey.answers.map(el => el.answer);

      if (!surveyAvailableAnswers.includes(httpRequest.body.answer)) {
        return forbidden(new InvalidParamError('answer'));
      }

      const updatedSurvey = await this.saveSurveyResult.save({
        accountId,
        answer,
        surveyId,
        date: new Date(),
      });

      return ok(updatedSurvey);
    } catch (err) {
      return serverError(err);
    }
  };
}
