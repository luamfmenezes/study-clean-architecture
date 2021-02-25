import jwt from 'jsonwebtoken';
import { Decrypter } from '../../../data/protocols/cryptograph/decrypter';
import { Encrypt } from '../../../data/protocols/cryptograph/encrypt';

export class JwtAdatper implements Encrypt, Decrypter {
  private readonly secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  async encrypt(value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secretKey);
    return accessToken;
  }

  async decrypt(token: string): Promise<string | undefined> {
    const decryptedValue = jwt.verify(token, this.secretKey) as string;
    return decryptedValue;
  }
}
