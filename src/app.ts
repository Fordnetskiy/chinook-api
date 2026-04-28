import express from 'express';
import helmet from 'helmet';
import { ErrorHandler, ResourceNotFound } from './middlewares/error.handler';

const ServerStart = () => {
  const app = express();

  app
    .use(helmet())
    .use(express.json())
    .use(express.urlencoded({ extended: true }));

  app.use(ResourceNotFound);
  app.use(ErrorHandler);

  return app;
};

export default ServerStart;
