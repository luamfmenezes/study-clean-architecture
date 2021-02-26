import {
  badRequest,
  noContent,
  serverError,
} from '../../../helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddSurvey,
  Validation,
} from './add-survey-controller-protocols';

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;

      const validationError = this.validation.validate(body);

      if (validationError) {
        return badRequest(validationError);
      }

      const { question, answers } = body;

      await this.addSurvey.add({ question, answers, date: new Date() });

      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
