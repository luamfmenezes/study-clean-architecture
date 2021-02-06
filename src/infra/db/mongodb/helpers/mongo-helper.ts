import { Collection, MongoClient } from 'mongodb';

class MongoHelper {
  client: MongoClient | null;

  uri: string;

  connect = async (uri?: string): Promise<void> => {
    this.uri = uri || process.env.MONGO_URL || '';
    this.client = await MongoClient.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  };

  disconnect = async () => {
    this.client?.close();
    this.client = null;
  };

  async getCollection(name: string): Promise<Collection> {
    if (!this.client?.isConnected) {
      await this.connect(this.uri);
    }
    return this.client?.db().collection(name) as Collection;
  }

  map = (collection: any): any => {
    const { _id, ...collectionWithOutId } = collection;
    return Object.assign(collectionWithOutId, { id: _id });
  };
}

export default new MongoHelper();
