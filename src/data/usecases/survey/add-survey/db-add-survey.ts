import {
  AddSurvey,
  AddSurveyParams,
  AddSurveyRepository,
} from './db-add-survey-protocols';

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(surveyData: AddSurveyParams) {
    const survey = await this.addSurveyRepository.add(surveyData);
  }
}
