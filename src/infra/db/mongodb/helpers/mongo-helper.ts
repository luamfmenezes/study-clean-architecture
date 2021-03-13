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

  map = (data: any): any => {
    const { _id, ...dataWithOutId } = data;
    return Object.assign(dataWithOutId, { id: _id });
  };

  mapCollection = (collection: any[]): any[] => {
    return collection.map(el => this.map(el));
  };
}

export default new MongoHelper();
