import 'dotenv/config';
import ServerStart from './app';
import { prisma } from './config/db';
import { connectRedis } from './config/redis';
import { logger } from './utils/logger';

const server = ServerStart();

try {
  await prisma.$connect();
  await prisma.$queryRaw`SELECT 1`;
  logger.info('DB connected');

  await connectRedis();
  logger.info('Redis connected');
} catch (e) {
  logger.error('Failed to start server', e);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server is running on PORT - ${PORT}`);
});
