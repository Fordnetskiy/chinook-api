import redis from 'redis';
import { logger } from '../utils/logger';

const REDIS_URL = process.env.REDIS_URL;

const client = redis.createClient({
  url: REDIS_URL,
});

client.on('error', (err) => {
  logger.error(`Redis Error: ${err}`);
});

export const connectRedis = async (): Promise<void> => {
  await client.connect();
};

export default client;
