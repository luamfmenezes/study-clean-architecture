import jwt from 'jsonwebtoken';
import { JwtAdatper } from './jwt-adapter';

const makeSut = () => {
  const sut = new JwtAdatper('secret');
  return { sut };
};

jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => 'token',
  verify: async (): Promise<string> => 'value',
}));

describe('JWT adapter', () => {
  describe('method - sign', () => {
    test('Should call sign with correct values', () => {
      const encryptSpy = jest.spyOn(jwt, 'sign');
      const { sut } = makeSut();
      sut.encrypt('id');
      expect(encryptSpy).toHaveBeenCalledWith({ id: 'id' }, 'secret');
    });
    test('Should return a token when sign succed', async () => {
      const { sut } = makeSut();
      const token = await sut.encrypt('id');
      expect(token).toBe('token');
    });
    test('Should trhows if jwt throws', async () => {
      const { sut } = makeSut();
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error();
      });
      const trySign = sut.encrypt('id');
      expect(trySign).rejects.toThrow();
    });
  });
  describe('method: verify()', () => {
    test('Should call verify with correct values', () => {
      const spyVerify = jest.spyOn(jwt, 'verify');
      const { sut } = makeSut();
      sut.decrypt('token');
      expect(spyVerify).toHaveBeenCalledWith('token', 'secret');
    });
    test('Should return a value when verify succed', async () => {
      const { sut } = makeSut();
      const token = await sut.decrypt('token');
      expect(token).toBe('value');
    });
    test('Should trhows if jwt throws', async () => {
      const { sut } = makeSut();
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error();
      });
      const trySign = sut.decrypt('token');
      expect(trySign).rejects.toThrow();
    });
  });
});
