import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  AddAccount,
} from './signUp-protocols';

export default class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  // Tip: two ways of catch the dependece injection
  constructor(
    emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
  ) {
    this.emailValidator = emailValidator;
  }

  public handle = (httpRequest: HttpRequest): HttpResponse => {
    try {
      const { email, name, password, passwordConfirmation } = httpRequest.body;

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

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const emailIsValid = this.emailValidator.isValid(email);

      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = this.addAccount.add({
        email,
        name,
        password,
      });

      return {
        statusCode: 200,
        body: account,
      };
    } catch {
      return serverError();
    }
  };
}