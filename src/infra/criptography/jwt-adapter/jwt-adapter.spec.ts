import jwt from 'jsonwebtoken';
import { JwtAdatper } from './jwt-adapter';

const makeSut = () => {
  const sut = new JwtAdatper('secret');
  return { sut };
};

jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => 'token',
}));

describe('JWT adapter', () => {
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
