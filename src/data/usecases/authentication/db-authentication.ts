import { HashCompare } from '../../protocols/hash-compare';
import { TokenGenerator } from '../../protocols/token-generator';
import { UpdateAccessTokenRepository } from '../../protocols/update-access-token-repository';
import {
  AccountModel,
  Authentication,
  AuthenticationModel,
  LoadAccountByEmailRepository,
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  private readonly hashCompare: HashCompare;

  private readonly tokenGenerator: TokenGenerator;

  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashCompare = hashCompare;
    this.tokenGenerator = tokenGenerator;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
  }

  auth = async (
    authentication: AuthenticationModel,
  ): Promise<string | undefined> => {
    const { password } = authentication;

    const account = await this.loadAccountByEmailRepository.load(
      authentication.email,
    );

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

    const token = await this.tokenGenerator.generate(account.id);

    await this.updateAccessTokenRepository.update(account.id, token);

    return token;
  };
}
