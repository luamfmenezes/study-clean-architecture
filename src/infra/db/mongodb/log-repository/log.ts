import { LogRepository } from '../../../../data/protocols/log-error-repository';
import MongoHelper from '../helpers/mongo-helper';

export class LogMongoRepository implements LogRepository {
  logError = async (stack: string): Promise<void> => {
    const errorsCollection = await MongoHelper.getCollection('errors');

    await errorsCollection.insertOne({
      stack,
      date: new Date(),
    });
  };
}
