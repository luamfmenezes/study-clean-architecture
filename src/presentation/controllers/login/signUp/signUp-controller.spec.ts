import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  Validation,
  Authentication,
} from './signUp-controller-protocols';
import SignUpController from './SignUp-controller';
import {
  badRequest,
  forbidden,
  serverError,
} from '../../../helpers/http/http-helper';
import { HttpRequest } from '../../../protocols';
import { EmailInUseError } from '../../../errors';

interface SubTypes {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
}

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub {
    auth = async (): Promise<string | undefined> => 'token';
  }
  return new AuthenticationStub();
};

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate = (): Error | undefined => {
      return undefined;
    };
  }
  return new ValidationStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add = async (account: AddAccountModel): Promise<AccountModel> => {
      return {
        id: 'valid-id',
        name: account.name,
        email: account.email,
        password: account.password,
      };
    };
  }
  return new AddAccountStub();
};

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'jhondoe@email.com',
    name: 'jhondoe',
    password: 'password',
    passwordConfirmation: 'password',
  },
});

const makeSut = (): SubTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidationStub();
  const authenticationStub = makeAuthenticationStub();
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub,
  );
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub,
  };
};

describe('SignUp Controller', () => {
  it('should call AddAccount with user data', async () => {
    const { sut, addAccountStub } = makeSut();
    const spyAdd = jest.spyOn(addAccountStub, 'add');

    const httpRequest = makeFakeHttpRequest();

    sut.handle(httpRequest);

    expect(spyAdd).toBeCalledWith({
      email: 'jhondoe@email.com',
      name: 'jhondoe',
      password: 'password',
    });
  });

  it('should return 500 if AddAccount throws an Error', async () => {
    const { sut, addAccountStub } = makeSut();

    addAccountStub.add = async () =>
      new Promise((resolve, rejects) => rejects(new Error()));

    const httpRequest = makeFakeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

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

  it('should call authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();

    const authenticationSpy = jest.spyOn(authenticationStub, 'auth');

    const httpRequest = makeFakeHttpRequest();

    await sut.handle(httpRequest);

    expect(authenticationSpy).toBeCalledWith({
      email: 'jhondoe@email.com',
      password: 'password',
    });
  });
  it('should return 500 if authentication.auth throws', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockImplementation(() => {
      throw new Error();
    });

    const httpRequest = makeFakeHttpRequest();

    const response = await sut.handle(httpRequest);

    expect(response).toEqual(serverError(new Error()));
  });

  it('should return 403 if addAccount return null', async () => {
    const { sut, addAccountStub } = makeSut();

    jest.spyOn(addAccountStub, 'add').mockResolvedValue(undefined);

    const httpRequest = makeFakeHttpRequest();

    const response = await sut.handle(httpRequest);

    expect(response).toEqual(forbidden(new EmailInUseError()));
  });

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({ accessToken: 'token' });
  });
});
