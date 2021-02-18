import { HttpRequest, HttpResponse } from './index';

export interface Middleware {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}
