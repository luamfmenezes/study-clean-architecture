import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from './protocols';

export default class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  public handle = (httpRequest: HttpRequest): HttpResponse => {
    try {
      if (!httpRequest.body.name) {
        return badRequest(new MissingParamError('name'));
      }
      if (!httpRequest.body.email) {
        return badRequest(new MissingParamError('email'));
      }

      const requireFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];

      for (const field of requireFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const emailIsValid = this.emailValidator.isValid(httpRequest.body.email);

      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'));
      }

      return {
        statusCode: 200,
      };
    } catch {
      return serverError();
    }
  };
}
