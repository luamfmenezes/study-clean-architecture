import { Collection, MongoClient } from 'mongodb';

class MongoHelper {
  client: MongoClient;

  connect = async (uri: string | undefined): Promise<void> => {
    this.client = await MongoClient.connect(
      uri || process.env.MONGO_URL || '',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
  };

  disconnect = async () => {
    this.client.close();
  };

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  }

  map = (collection: any): any => {
    const { _id, ...collectionWithOutId } = collection;
    return Object.assign(collectionWithOutId, { id: _id });
  };
}

export default new MongoHelper();
