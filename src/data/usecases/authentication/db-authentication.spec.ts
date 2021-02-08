import { AccountModel } from '../../../domain/models/account';
import { AuthenticationModel } from '../../../domain/usecases/authentication';
import { HashCompare } from '../../protocols/hash-compare';
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';
import { TokenGenerator } from '../../protocols/token-generator';
import { UpdateAccessTokenRepository } from '../../protocols/update-access-token-repository';
import { DbAuthentication } from './db-authentication';

const makeFakeAccount = (): AccountModel => ({
  id: 'valid-id',
  password: 'hashedPassword',
  name: 'jhondoe',
  email: 'jhondoe@email.com',
});

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'jhondoe@email.com',
  password: 'password',
});

function makeLoadAccountByEmailRepositoryStub(): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    load = async (): Promise<AccountModel | undefined> => makeFakeAccount();
  }
  return new LoadAccountByEmailRepositoryStub();
}

function makeUpdateAccessTokenRepositoryStub(): UpdateAccessTokenRepository {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    update = async (): Promise<void> => new Promise(resolve => resolve());
  }
  return new UpdateAccessTokenRepositoryStub();
}

function makeTokenGeneratorStub(): TokenGenerator {
  class TokenGeneratorStub implements TokenGenerator {
    generate = async (): Promise<string> => 'valid-token';
  }
  return new TokenGeneratorStub();
}

function makeHashCompareStub(): HashCompare {
  class HashCompareStub implements HashCompare {
    compare = async (): Promise<boolean> => true;
  }
  return new HashCompareStub();
}

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashCompareStub: HashCompare;
  tokenGeneratorStub: TokenGenerator;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub();
  const hashCompareStub = makeHashCompareStub();
  const tokenGeneratorStub = makeTokenGeneratorStub();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    await sut.auth(makeFakeAuthentication());

    expect(loadSpy).toBeCalledWith('jhondoe@email.com');
  });
  test('Should trhow if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const tryAuth = sut.auth(makeFakeAuthentication());

    await expect(tryAuth).rejects.toThrow();
  });
  test('Should return undefined if LoadAccountByEmailRepository return undefined', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(new Promise(resolve => resolve(undefined)));

    const accessToken = await sut.auth(makeFakeAuthentication());

    expect(accessToken).toBeUndefined();
  });
  test('Should call HashCompare with password', async () => {
    const { sut, hashCompareStub } = makeSut();

    const { password } = makeFakeAuthentication();
    const { password: hashedPassword } = makeFakeAccount();

    const compareSpy = jest.spyOn(hashCompareStub, 'compare');

    await sut.auth(makeFakeAuthentication());

    expect(compareSpy).toHaveBeenCalledWith(password, hashedPassword);
  });
  test('Should call HashCompare with password', async () => {
    const { sut, hashCompareStub } = makeSut();

    const { password } = makeFakeAuthentication();
    const { password: hashedPassword } = makeFakeAccount();

    const compareSpy = jest.spyOn(hashCompareStub, 'compare');

    await sut.auth(makeFakeAuthentication());

    expect(compareSpy).toHaveBeenCalledWith(password, hashedPassword);
  });
  test('Should throw if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut();

    jest.spyOn(hashCompareStub, 'compare').mockImplementation(() => {
      throw Error();
    });

    const tryAuth = sut.auth(makeFakeAuthentication());

    await expect(tryAuth).rejects.toThrow();
  });
  test('Should return undefined if hashCompare return false', async () => {
    const { sut, hashCompareStub } = makeSut();

    jest
      .spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(new Promise(resolve => resolve(false)));

    const accessToken = await sut.auth(makeFakeAuthentication());

    expect(accessToken).toBeUndefined();
  });
  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();

    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');

    await sut.auth(makeFakeAuthentication());

    expect(generateSpy).toHaveBeenCalledWith('valid-id');
  });
  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut();

    jest.spyOn(tokenGeneratorStub, 'generate').mockImplementation(() => {
      throw Error();
    });

    const tryAuth = sut.auth(makeFakeAuthentication());

    await expect(tryAuth).rejects.toThrow();
  });
  test('Should return a valid token when provided with valid credentials', async () => {
    const { sut } = makeSut();

    const token = await sut.auth(makeFakeAuthentication());

    expect(token).toEqual('valid-token');
  });
  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update');

    await sut.auth(makeFakeAuthentication());

    expect(updateSpy).toHaveBeenCalledWith('valid-id', 'valid-token');
  });
  test('Should throw if UpdateAccessTokenRepositoryStub throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    jest
      .spyOn(updateAccessTokenRepositoryStub, 'update')
      .mockImplementation(() => {
        throw Error();
      });

    const tryAuth = sut.auth(makeFakeAuthentication());

    await expect(tryAuth).rejects.toThrow();
  });
});
