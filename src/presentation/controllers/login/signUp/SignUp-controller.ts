import { EmailInUseError } from '../../../errors';
import {
  badRequest,
  serverError,
  ok,
  forbidden,
} from '../../../helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
  Validation,
  Authentication,
} from './signUp-controller-protocols';

export default class SignUpController implements Controller {
  private readonly addAccount: AddAccount;

  private readonly validation: Validation;

  private readonly authentication: Authentication;

  constructor(
    addAccount: AddAccount,
    validation: Validation,
    authentication: Authentication,
  ) {
    this.addAccount = addAccount;
    this.validation = validation;
    this.authentication = authentication;
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

      if (!account) {
        return forbidden(new EmailInUseError());
      }

      const accessToken = await this.authentication.auth({
        email,
        password,
      });

      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  };
}
