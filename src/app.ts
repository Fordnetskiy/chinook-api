import express from 'express';
import helmet from 'helmet';
import v1Routes from './modules/index';
import { ErrorHandler, ResourceNotFound } from './middlewares/error.handler';
import { logger } from './utils/logger';

const ServerStart = () => {
  try {
    const app = express();

    app
      .use(helmet())
      .use(express.json())
      .use(express.urlencoded({ extended: true }));

    app.use('/api/v1', v1Routes);

    app.use(ResourceNotFound);
    app.use(ErrorHandler);

    return app;
  } catch (e) {
    logger.error('Failed to start server', e);
    process.exit(1);
  }
};

export default ServerStart;
