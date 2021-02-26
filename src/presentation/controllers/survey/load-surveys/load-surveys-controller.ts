import {
  noContent,
  ok,
  serverError,
  LoadSurveys,
} from './load-surveys-controller-protocols';
import { Controller, HttpResponse } from '../../../protocols';

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
