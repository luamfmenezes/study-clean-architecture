import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '../../helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Authentication,
  Validation,
} from './login-protocols';

export class LoginController implements Controller {
  private readonly validation: Validation;

  private readonly authentication: Authentication;

  constructor(validation: Validation, authentication: Authentication) {
    this.validation = validation;
    this.authentication = authentication;
  }

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const { email, password } = httpRequest.body;

      const error = this.validation.validate({ email, password });

      if (error) {
        return badRequest(error);
      }

      const accessToken = await this.authentication.auth(email, password);

      if (!accessToken) {
        return unauthorized();
      }

      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  };
}
