import { SurveyModels } from '../../../../domain/models/survey';

export interface LoadSurveyByIdRepository {
  loadById(id: string): Promise<SurveyModels | undefined>;
}
