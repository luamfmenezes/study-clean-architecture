import { SurveyModels } from '../../../../domain/models/survey';
import { LoadSurveyById } from '../../../../domain/usecases/survey/load-surveys-by-id';
import { LoadSurveyByIdRepository } from '../../../protocols/db/survey/load-survey-by-id-repository';

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}
  loadById = async (id: string): Promise<SurveyModels | undefined> => {
    const survey = await this.loadSurveyByIdRepository.loadById(id);

    return survey;
  };
}
