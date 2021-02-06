import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  hash: async () => 'hashed_value',
}));

const salt = 12;

const makeSut = (): BcryptAdapter => new BcryptAdapter(salt);

describe('Bcrypt Adapter', () => {
  test('should call bcrypt with correct values', () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });
  test('should return a hash on success', async () => {
    const sut = makeSut();
    const hash = await sut.encrypt('any_value');
    expect(hash).toBe('hashed_value');
  });
  test('should trhow if bcrypt.hash throw', async () => {
    const sut = makeSut();

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });

    const promiseEncrypt = sut.encrypt('any_value');

    await expect(promiseEncrypt).rejects.toThrow();
  });
});
