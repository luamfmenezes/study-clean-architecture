import { InvalidParamError, MissingParamError } from '../errors';
import { EmailValidator } from './protocols';
import SignUpController from './SignUp';

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
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

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new SignUpController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'jhondoe@email.com',
        password: 'password',
        passwordConfirmation: 'password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });
  it('should return 400 if no email is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'jhondoe',
        password: 'password',
        passwordConfirmation: 'password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });
  it('should return 400 if no password is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'jhondoe@email.com',
        name: 'jhondoe',
        passwordConfirmation: 'password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('should return 400 if no confirmationPassword is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'jhondoe@email.com',
        name: 'jhondoe',
        password: 'password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation'),
    );
  });

  it('should return 400 if invalid email is provided', () => {
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

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('should return 500 if invalid email throws Error', () => {
    const emailValidatorStub = makeEmailValidator();

    // Tip: it's possible do this usign jest.spy().mockImplementation
    emailValidatorStub.isValid = () => {
      throw new Error();
    };

    const sut = new SignUpController(emailValidatorStub);

    const httpRequest = {
      body: {
        email: 'invalid@email.com',
        name: 'jhondoe',
        password: 'password',
        passwordConfirmation: 'password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  it('should call EmailValidator with correct email', () => {
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
});
