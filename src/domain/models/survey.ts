export interface SurveyAnswerModel {
  image?: string;
  answer: string;
}

export interface SurveyModels {
  id: string;
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
}
