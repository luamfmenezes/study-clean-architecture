import { HttpRequest, Authentication, Validation } from './login-protocols';
import { LoginController } from './login';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '../../helpers/http/http-helper';

interface SutTypes {
  sut: LoginController;
  validationStub: Validation;
  authenticationStub: Authentication;
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate = (): Error | undefined => undefined;
  }
  return new ValidationStub();
};

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub {
    auth = async (): Promise<string | undefined> => 'token';
  }
  return new AuthenticationStub();
};

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub();
  const validationStub = makeValidationStub();
  const sut = new LoginController(validationStub, authenticationStub);
  return { sut, validationStub, authenticationStub };
};

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'jhondoe@email.com',
    password: 'password',
  },
});

describe('Login Controller', () => {
  it('should call validation with correct value', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeHttpRequest();

    sut.handle(httpRequest);

    expect(validateSpy).toBeCalledWith(httpRequest.body);
  });

  it('should return 400 if Validation return an error', async () => {
    const { sut, validationStub } = makeSut();

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());

    const httpRequest = makeFakeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, 'auth');

    const httpRequest = makeFakeHttpRequest();

    await sut.handle(httpRequest);

    const { email, password } = httpRequest.body;

    expect(authSpy).toHaveBeenCalledWith({ email, password });
  });

  test('Should retrun 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();

    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise(resolve => resolve(undefined)));

    const httpRequest = makeFakeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(unauthorized());
  });

  test('Should return 500 if authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = makeFakeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should retrun token when is provided with valid data', async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(ok({ accessToken: 'token' }));
  });
});
