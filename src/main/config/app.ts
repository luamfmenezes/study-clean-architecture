import express from 'express';
import setupMiddlewares from './middlewares';
import setupRoutes from './routes';
import setSwagger from './config-swagger';

const app = express();

setSwagger(app);

setupMiddlewares(app);

setupRoutes(app);

export default app;
