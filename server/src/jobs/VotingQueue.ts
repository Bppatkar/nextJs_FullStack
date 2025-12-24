import { Job, Queue, Worker } from 'bullmq';
import { defaultQueueOptions, redisConnection } from '../lib/queue.js';
import prisma from '../lib/prisma.js';

export const votingQueueName = 'votingQueue';

export const votingQueue = new Queue(votingQueueName, {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultQueueOptions,
    delay: 500,
  },
});

// * Workers
export const handler = new Worker(
  votingQueueName,
  async (job: Job) => {
    const data = job.data;
    await prisma.clashItem.update({
      where: {
        id: Number(data?.clashItemId),
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });
  },
  { connection: redisConnection }
);
