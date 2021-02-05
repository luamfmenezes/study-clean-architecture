import { HttpRequest, HttpResponse } from './index';

export interface Controller {
  handle(httpRequest: HttpRequest): HttpResponse;
}
