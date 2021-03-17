import {
  AccountModel,
  AuthenticationParams,
  HashCompare,
  LoadAccountByEmailRepository,
  TokenGenerator,
  UpdateAccessTokenRepository,
} from './db-authentication-protocols';
import { DbAuthentication } from './db-authentication';
import { Encrypt } from '../../../protocols/cryptograph/encrypt';

const makeFakeAccount = (): AccountModel => ({
  id: 'valid-id',
  password: 'hashedPassword',
  name: 'jhondoe',
  email: 'jhondoe@email.com',
});

const makeFakeAuthentication = (): AuthenticationParams => ({
  email: 'jhondoe@email.com',
  password: 'password',
});

function makeLoadAccountByEmailRepositoryStub(): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    loadByEmail = async (): Promise<AccountModel | undefined> =>
      makeFakeAccount();
  }
  return new LoadAccountByEmailRepositoryStub();
}

function makeUpdateAccessTokenRepositoryStub(): UpdateAccessTokenRepository {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    updateAccessToken = async (): Promise<void> =>
      new Promise(resolve => resolve());
  }
  return new UpdateAccessTokenRepositoryStub();
}

function makeEncryptStub(): Encrypt {
  class EncryptStub implements Encrypt {
    encrypt = async (): Promise<string> => 'valid-token';
  }
  return new EncryptStub();
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
  encryptStub: Encrypt;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub();
  const hashCompareStub = makeHashCompareStub();
  const encryptStub = makeEncryptStub();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encryptStub,
    updateAccessTokenRepositoryStub,
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encryptStub,
    updateAccessTokenRepositoryStub,
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');

    await sut.auth(makeFakeAuthentication());

    expect(loadSpy).toBeCalledWith('jhondoe@email.com');
  });
  test('Should trhow if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const tryAuth = sut.auth(makeFakeAuthentication());

    await expect(tryAuth).rejects.toThrow();
  });
  test('Should return undefined if LoadAccountByEmailRepository return undefined', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
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

    jest.spyOn(hashCompareStub, 'compare').mockImplementationOnce(() => {
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
    const { sut, encryptStub } = makeSut();

    const generateSpy = jest.spyOn(encryptStub, 'encrypt');

    await sut.auth(makeFakeAuthentication());

    expect(generateSpy).toHaveBeenCalledWith('valid-id');
  });
  test('Should throw if TokenGenerator throws', async () => {
    const { sut, encryptStub } = makeSut();

    jest.spyOn(encryptStub, 'encrypt').mockImplementationOnce(() => {
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

    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken',
    );

    await sut.auth(makeFakeAuthentication());

    expect(updateSpy).toHaveBeenCalledWith('valid-id', 'valid-token');
  });
  test('Should throw if UpdateAccessTokenRepositoryStub throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockImplementationOnce(() => {
        throw Error();
      });

    const tryAuth = sut.auth(makeFakeAuthentication());

    await expect(tryAuth).rejects.toThrow();
  });
});
