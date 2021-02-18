import { forbidden, ok, serverError } from '../helpers/http/http-helper';
import { AccessDeniedError } from '../errors/access-denied-error';
import { AuthMiddleware } from './auth-middleware';
import {
  HttpRequest,
  Middleware,
  AccountModel,
  LoadAccountByToken,
} from './auth-middleware-protocols';

const makeAccountModel = (): AccountModel => ({
  id: 'valid-id',
  email: 'jhondoe@email.com',
  name: 'jhondoe',
  password: 'password',
});

const makeLoadAccountByTokenStub = () => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    load = async (): Promise<AccountModel> => makeAccountModel();
  }
  return new LoadAccountByTokenStub();
};

interface SutTypes {
  sut: Middleware;
  loadAccountByTokenStub: LoadAccountByToken;
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);
  return { sut, loadAccountByTokenStub };
};

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {},
  headers: {
    'x-access-token': 'token',
  },
});

describe('Auth Middleware', () => {
  test('Should return forbbiden-403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const response = await sut.handle({});
    expect(response).toEqual(forbidden(new AccessDeniedError()));
  });
  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut('role');

    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');

    await sut.handle(makeFakeHttpRequest());

    expect(loadSpy).toHaveBeenCalledWith('token', 'role');
  });
  test('Should return forbbiden-403 if loadAccountByToken return undefined', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();

    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValue(undefined);

    const response = await sut.handle(makeFakeHttpRequest());

    expect(response).toEqual(forbidden(new AccessDeniedError()));
  });
  test('Should return serverError-500 if loadAccountByToken trhows ', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();

    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(() => {
      throw new Error();
    });

    const response = await sut.handle(makeFakeHttpRequest());

    expect(response).toEqual(serverError(new Error()));
  });
  test('Should return ok-200 when provided with valid data', async () => {
    const { sut } = makeSut();

    const response = await sut.handle(makeFakeHttpRequest());

    expect(response).toEqual(ok({ accountId: 'valid-id' }));
  });
});
