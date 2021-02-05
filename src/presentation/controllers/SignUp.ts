import MissingParamError from '../errors/missing-param-error';
import { HttpRequest, HttpResponse } from './protocols/Http';
import { badRequest } from '../helpers/http-helper';
import { Controller } from './protocols/Controller';

export default class SignUpController implements Controller {
  public handle = (httpRequest: HttpRequest): HttpResponse => {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'));
    }
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'));
    }

    const requireFields = ['name', 'email', 'password', 'passwordConfirmation'];

    for (const field of requireFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    return {
      statusCode: 200,
    };
  };
}
