import app from './config/app';
import MongoHelper from '../infra/db/mongodb/helpers/mongo-helper';
import env from './config/env';

const startServer = async () => {
  await MongoHelper.connect(env.mongoUrl);

  app.listen(env.port, () => {
    console.log(`Sever running at http:localhost:${env.port}`);
  });
};

startServer();
