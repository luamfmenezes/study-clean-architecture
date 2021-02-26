import { SurveyModels } from '../../../../domain/models/survey';

export interface LoadSurveysRepository {
  loadAll(): Promise<SurveyModels[]>;
}
