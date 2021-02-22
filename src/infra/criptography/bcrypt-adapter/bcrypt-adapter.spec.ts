import bcrypt, { compare } from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> => 'hashed_value',
  compare: async (): Promise<boolean> => true,
}));

const salt = 12;

const makeSut = (): BcryptAdapter => new BcryptAdapter(salt);

describe('Bcrypt Adapter', () => {
  describe('hash', () => {
    test('should call bcrypt.hash with correct values', () => {
      const sut = makeSut();
      const hashSpy = jest.spyOn(bcrypt, 'hash');
      sut.hash('any_value');
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });
    test('should return a hash on success', async () => {
      const sut = makeSut();
      const hash = await sut.hash('any_value');
      expect(hash).toBe('hashed_value');
    });
    test('should trhow if bcrypt.hash throw', async () => {
      const sut = makeSut();

      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw new Error();
      });

      const promiseHasher = sut.hash('any_value');

      await expect(promiseHasher).rejects.toThrow();
    });
  });
  describe('compare', () => {
    test('should call bcrypt.compare with correct values', () => {
      const sut = makeSut();
      const compareSpy = jest.spyOn(bcrypt, 'compare');
      sut.compare('any_value', 'any_value_hashed');
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_value_hashed');
    });
    test('should return false when bcrypt.compare is called invalid values', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);
      const comparatedValue = await sut.compare(
        'any_value',
        'any_value_hashed',
      );
      expect(comparatedValue).toBe(false);
    });
    test('should return false when bcrypt.compare is called with correct values', async () => {
      const sut = makeSut();
      const comparatedValue = await sut.compare(
        'any_value',
        'any_value_hashed',
      );
      expect(comparatedValue).toBe(true);
    });
    test('should trhow if bcrypt.compare throw', async () => {
      const sut = makeSut();

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
        throw new Error();
      });

      const promiseCompare = sut.compare('any_value', 'any_value_hashed');

      await expect(promiseCompare).rejects.toThrow();
    });
  });
});
