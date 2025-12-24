import { Job, Queue, Worker } from 'bullmq';
import { defaultQueueOptions, redisConnection } from '../lib/queue.js';

export const testQueueName = 'test';

export const testQueue = new Queue(testQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueOptions,
});

// * Workers
export const handler = new Worker(
  testQueueName,
  async (job: Job) => {
    console.log('The test queue data is', job?.data);
  },
  { connection: redisConnection }
);
