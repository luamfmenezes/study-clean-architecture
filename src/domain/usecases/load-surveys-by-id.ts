import { SurveyModels } from '../models/survey';

export interface LoadSurveys {
  load(): Promise<SurveyModels[]>;
}
