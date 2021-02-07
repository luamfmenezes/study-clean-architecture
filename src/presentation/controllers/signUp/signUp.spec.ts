import {
  EmailValidator,
  AddAccount,
  AddAccountModel,
  AccountModel,
  Validation,
} from './signUp-protocols';
import SignUpController from './SignUp';
import { badRequest, serverError } from '../../helpers/http/http-helper';
import { HttpRequest } from '../../protocols';

interface SubTypes {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
}

/*
 Improviment: create a factory outside of the text
 Or create a fakeEmailValidator
 */

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate = (): Error | undefined => {
      return undefined;
    };
  }
  return new ValidationStub();
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid = (): boolean => {
      return true;
    };
  }
  return new EmailValidatorStub();
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
  const sut = new SignUpController(addAccountStub, validationStub);
  return {
    sut,
    addAccountStub,
    validationStub,
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

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: 'valid-id',
      email: 'jhondoe@email.com',
      name: 'jhondoe',
      password: 'password',
    });
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
});
