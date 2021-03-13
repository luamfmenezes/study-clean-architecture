import {
  AddSurvey,
  AddSurveyModel,
  AddSurveyRepository,
} from './db-add-survey-protocols';

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(surveyData: AddSurveyModel) {
    const survey = await this.addSurveyRepository.add(surveyData);
  }
}
