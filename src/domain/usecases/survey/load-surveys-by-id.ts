import { SurveyModels } from '../../models/survey';

export interface LoadSurveyById {
  loadById(id: string): Promise<SurveyModels | undefined>;
}
