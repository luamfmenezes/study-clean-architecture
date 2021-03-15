import { SurveyModels } from '../../../../domain/models/survey';
import { LoadSurveys } from '../../../../domain/usecases/survey/load-surveys';
import { LoadSurveysRepository } from '../../../protocols/db/survey/load-surveys-repository';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}

  load = async (): Promise<SurveyModels[]> => {
    const surveys = await this.loadSurveysRepository.loadAll();
    return surveys;
  };
}