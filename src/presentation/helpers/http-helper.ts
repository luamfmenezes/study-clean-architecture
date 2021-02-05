import { HttpResponse } from '../controllers/protocols/Http';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});
