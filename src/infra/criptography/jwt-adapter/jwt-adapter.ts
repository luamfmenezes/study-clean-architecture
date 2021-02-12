import jwt from 'jsonwebtoken';
import { Encrypt } from '../../../data/protocols/cryptograph/encrypt';

export class JwtAdatper implements Encrypt {
  private readonly secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  async encrypt(value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secretKey);
    return accessToken;
  }
}
