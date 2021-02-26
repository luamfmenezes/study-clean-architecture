import { LoadSurveys } from '../../../../domain/usecases/load-surveys';
import { noContent, ok, serverError } from '../../../helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../../protocols';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  handle = async (): Promise<HttpResponse> => {
    try {
      const surveys = await this.loadSurveys.load();

      if (surveys.length === 0) {
        return noContent();
      }

      return ok(surveys);
    } catch (error) {
      return serverError(error);
    }
  };
}
