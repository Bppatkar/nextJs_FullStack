import { ConnectionOptions, DefaultJobOptions } from 'bullmq';
import IORedis from 'ioredis';

export const redisConnection: ConnectionOptions = new IORedis.default({
  host: process.env.REDIS_HOST,
  port: 6379,
});

export const defaultQueueOptions: DefaultJobOptions = {
  removeOnComplete: {
    count: 20,
    age: 60 * 60,
  },
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 3000,
  },
  removeOnFail: false,
};
