import { LoadSurveys } from '../../../../domain/usecases/load-surveys';
import { ok, serverError } from '../../../helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../../protocols';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  handle = async (): Promise<HttpResponse> => {
    try {
      const surveys = await this.loadSurveys.load();
      return ok(surveys);
    } catch (error) {
      return serverError(error);
    }
  };
}
