import { AccessDeniedError } from '../errors/access-denied-error';
import { forbidden, ok, serverError } from '../helpers/http/http-helper';
import {
  HttpRequest,
  HttpResponse,
  Middleware,
  LoadAccountByToken,
} from './auth-middleware-protocols';

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string,
  ) {}

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const token = httpRequest.headers?.['x-access-token'];

      if (!token) {
        return forbidden(new AccessDeniedError());
      }

      const account = await this.loadAccountByToken.load(token, this.role);

      if (!account) {
        return forbidden(new AccessDeniedError());
      }

      return ok({ accountId: account.id });
    } catch (error) {
      return serverError(error);
    }
  };
}
