import bcrypt from 'bcrypt';
import { HashCompare } from '../../../data/protocols/cryptograph/hash-compare';
import { Hasher } from '../../../data/protocols/cryptograph/hasher';

export class BcryptAdapter implements Hasher, HashCompare {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }

  hash = async (value: string): Promise<string> => {
    return bcrypt.hash(value, this.salt);
  };

  compare = async (value: string, hashedValue: string): Promise<boolean> => {
    return bcrypt.compare(value, hashedValue);
  };
}
