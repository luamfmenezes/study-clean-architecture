import { AccountModel } from '../../../domain/models/account';
import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token';
import { Decrypter } from '../../protocols/cryptograph/decrypter';
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) {}

  load = async (
    token: string,
    role?: string,
  ): Promise<AccountModel | undefined> => {
    const decryptedToken = await this.decrypter.decrypt(token);

    if (!decryptedToken) {
      return undefined;
    }

    const account = await this.loadAccountByTokenRepository.loadByToken(
      token,
      role,
    );

    if (!account) {
      return undefined;
    }

    return account;
  };
}
