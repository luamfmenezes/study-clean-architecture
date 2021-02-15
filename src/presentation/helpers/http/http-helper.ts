import { HttpResponse } from '../../protocols';
import { ServerError, UnauthorizedError } from '../../errors';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error,
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack),
});

export const ok = <BodyType>(body: BodyType): HttpResponse => ({
  statusCode: 200,
  body,
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
});
