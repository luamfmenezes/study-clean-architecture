import { LogRepository } from '../../data/protocols/log-error-repository';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller;

  private readonly logErrorRepository: LogRepository;

  constructor(controller: Controller, logErrorRepository: LogRepository) {
    this.controller = controller;
    this.logErrorRepository = logErrorRepository;
  }

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode === 500) {
      this.logErrorRepository.logError(httpResponse.body.stack);
    }
    return httpResponse;
  };
}
