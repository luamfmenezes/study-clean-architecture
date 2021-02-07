import { badRequest, serverError, ok } from '../../helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
  Validation,
} from './signUp-protocols';

export default class SignUpController implements Controller {
  private readonly addAccount: AddAccount;

  private readonly validation: Validation;

  // Tip: two ways of catch the dependece injection
  constructor(addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount;
    this.validation = validation;
  }

  public handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const { email, name, password } = httpRequest.body;

      const validationError = this.validation.validate(httpRequest.body);

      if (validationError) {
        return badRequest(validationError);
      }

      const account = await this.addAccount.add({
        email,
        name,
        password,
      });

      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  };
}
