import { InvalidParamError, MissingParamError } from '../../errors';
import {
  EmailValidator,
  AddAccount,
  AddAccountModel,
  AccountModel,
  Validation,
} from './signUp-protocols';
import SignUpController from './SignUp';
import { badRequest, serverError } from '../../helpers/http-helper';
import { HttpRequest } from '../../protocols';

interface SubTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
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
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidationStub();
  const sut = new SignUpController(
    emailValidatorStub,
    addAccountStub,
    validationStub,
  );
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub,
  };
};

describe('SignUp Controller', () => {
  it('should return 400 if confirmationPassword is different of password', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'jhondoe@email.com',
        name: 'jhondoe',
        password: 'password',
        passwordConfirmation: 'invalid-password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirmation')),
    );
  });

  it('should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = makeFakeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('should return 500 if EmailValidator throws an Error', async () => {
    const { sut, emailValidatorStub } = makeSut();

    // Tip: it's possible do this usign jest.spy().mockImplementation
    emailValidatorStub.isValid = () => {
      throw new Error();
    };

    const httpRequest = makeFakeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const spyIsValid = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = makeFakeHttpRequest();

    sut.handle(httpRequest);

    expect(spyIsValid).toBeCalledWith('jhondoe@email.com');
  });

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
