import app from './config/app';
import MongoHelper from '../infra/db/mongodb/helpers/mongo-helper';
import env from './config/env';

const startServer = async () => {
  await MongoHelper.connect(env.mongoUrl);

  app.listen(5000, () => {
    console.log('Sever running at http:localhost:5000');
  });
};

startServer();
