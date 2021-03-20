import {
  loginPath,
  signUpPath,
  surveyPath,
  surveyResultPath,
} from './paths/index';

export default {
  '/login': loginPath,
  '/signup': signUpPath,
  '/surveys': surveyPath,
  '/surveys/{surveyId}/result': surveyResultPath,
};
