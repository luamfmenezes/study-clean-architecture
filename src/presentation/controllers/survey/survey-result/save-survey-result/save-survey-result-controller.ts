import { LoadSurveyById } from '../../../../../domain/usecases/survey/load-surveys-by-id';
import { InvalidParamError } from '../../../../errors';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../add-survey/add-survey-controller-protocols';
import { forbidden } from '../../load-surveys/load-surveys-controller-protocols';

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const survey = await this.loadSurveyById.loadById(
      httpRequest.params.surveyId,
    );

    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'));
    }

    return { statusCode: 2 };
  };
}
