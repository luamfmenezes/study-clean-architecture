import sut from './mongo-helper';

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect();
  });
  afterAll(async () => {
    await sut.disconnect();
  });

  test('should reconnect if mongodb is down when trying to get a collection', async () => {
    let accontCollection = await sut.getCollection('account');
    expect(accontCollection).toBeTruthy();
    await sut.disconnect();
    accontCollection = await sut.getCollection('account');
    expect(accontCollection).toBeTruthy();
  });
});
