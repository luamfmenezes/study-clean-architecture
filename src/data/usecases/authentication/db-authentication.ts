import { Encrypt } from '../../protocols/cryptograph/encrypt';
import {
  Authentication,
  AuthenticationModel,
  LoadAccountByEmailRepository,
  HashCompare,
  UpdateAccessTokenRepository,
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  private readonly hashCompare: HashCompare;

  private readonly encrypt: Encrypt;

  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    encrypt: Encrypt,
    updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashCompare = hashCompare;
    this.encrypt = encrypt;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
  }

  auth = async (
    authentication: AuthenticationModel,
  ): Promise<string | undefined> => {
    const { password, email } = authentication;

    const account = await this.loadAccountByEmailRepository.loadByEmail(email);

    if (!account) {
      return undefined;
    }

    const passwordIsValid = await this.hashCompare.compare(
      password,
      account.password,
    );

    if (!passwordIsValid) {
      return undefined;
    }

    const token = await this.encrypt.encrypt(account.id);

    await this.updateAccessTokenRepository.updateAccessToken(account.id, token);

    return token;
  };
}
