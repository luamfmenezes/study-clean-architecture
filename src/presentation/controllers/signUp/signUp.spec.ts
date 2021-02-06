import { InvalidParamError, MissingParamError } from '../../errors';
import {
  EmailValidator,
  AddAccount,
  AddAccountModel,
  AccountModel,
} from './signUp-protocols';
import SignUpController from './SignUp';

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

/*
 Improviment: create a factory outside of the text
 Or create a fakeEmailValidator
 --
 Factories
*/

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

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
  };
};

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'jhondoe@email.com',
        password: 'password',
        passwordConfirmation: 'password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'jhondoe',
        password: 'password',
        passwordConfirmation: 'password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });
  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'jhondoe@email.com',
        name: 'jhondoe',
        passwordConfirmation: 'password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('should return 400 if no confirmationPassword is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'jhondoe@email.com',
        name: 'jhondoe',
        password: 'password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation'),
    );
  });

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

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation'),
    );
  });

  it('should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        email: 'invalid@email.com',
        name: 'jhondoe',
        password: 'password',
        passwordConfirmation: 'password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('should return 500 if EmailValidator throws an Error', async () => {
    const { sut, emailValidatorStub } = makeSut();

    // Tip: it's possible do this usign jest.spy().mockImplementation
    emailValidatorStub.isValid = () => {
      throw new Error();
    };

    const httpRequest = {
      body: {
        email: 'invalid@email.com',
        name: 'jhondoe',
        password: 'password',
        passwordConfirmation: 'password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const spyIsValid = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        email: 'jhondoe@email.com',
        name: 'jhondoe',
        password: 'password',
        passwordConfirmation: 'password',
      },
    };

    sut.handle(httpRequest);

    expect(spyIsValid).toBeCalledWith('jhondoe@email.com');
  });

  it('should call AddAccount with user data', async () => {
    const { sut, addAccountStub } = makeSut();
    const spyAdd = jest.spyOn(addAccountStub, 'add');

    const httpRequest = {
      body: {
        email: 'jhondoe@email.com',
        name: 'jhondoe',
        password: 'password',
        passwordConfirmation: 'password',
      },
    };

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

    const httpRequest = {
      body: {
        email: 'invalid@email.com',
        name: 'jhondoe',
        password: 'password',
        passwordConfirmation: 'password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'jhondoe@email.com',
        name: 'jhondoe',
        password: 'password',
        passwordConfirmation: 'password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: 'valid-id',
      email: 'jhondoe@email.com',
      name: 'jhondoe',
      password: 'password',
    });
  });
});
