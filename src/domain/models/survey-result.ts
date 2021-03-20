interface SurveyResultAnswerModel {
  image?: string;
  answer: string;
  count: number;
  percent: number;
}

export interface SurveyResultModel {
  surveyId: string;
  question: string;
  answers: SurveyResultAnswerModel[];
}
