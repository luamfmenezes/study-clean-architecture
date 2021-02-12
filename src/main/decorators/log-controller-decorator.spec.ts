import { Controller, HttpResponse } from '../../presentation/protocols';
import { LogControllerDecorator } from './log-controller-decorator';
import { serverError } from '../../presentation/helpers/http/http-helper';
import { LogRepository } from '../../data/protocols/db/log/log-error-repository';

const makeLogRepositoryStub = (): LogRepository => {
  class LogRepositoryStub implements LogRepository {
    logError = async (stack: string): Promise<void> => {
      return new Promise(resolve => resolve());
    };
  }
  return new LogRepositoryStub();
};

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    handle = async (): Promise<HttpResponse> => {
      return { body: {}, statusCode: 200 };
    };
  }
  return new ControllerStub();
};

interface StuTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogRepository;
}

const makeSut = (): StuTypes => {
  const controllerStub = makeControllerStub();
  const logErrorRepositoryStub = makeLogRepositoryStub();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub,
  );
  return { sut, controllerStub, logErrorRepositoryStub };
};

describe('Log Controller Decoration', () => {
  test('should call controller handle when decorator handle has been called', async () => {
    const { sut, controllerStub } = makeSut();
    const controllerHandleSpy = jest.spyOn(controllerStub, 'handle');
    const httpRequest = {
      body: { body_field: 'body_field_value' },
    };
    await sut.handle(httpRequest);
    expect(controllerHandleSpy).toHaveBeenCalledWith(httpRequest);
  });
  test('should return the same result of the controller handle on decorator handle ', async () => {
    const { sut } = makeSut();
    const response = await sut.handle({});
    expect(response).toEqual({ body: {}, statusCode: 200 });
  });
  test('should call LogRepository if controller return ServerError ', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const fakeError = new Error('Fake mistake');
    fakeError.stack = 'fake-stack-error';

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');

    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(
        new Promise(resolve => resolve(serverError(fakeError))),
      );

    await sut.handle({});

    expect(logSpy).toHaveBeenCalledWith(fakeError.stack);
  });
});
