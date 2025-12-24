import { Job, Queue, Worker } from 'bullmq';

import prisma from '../lib/prisma.js';
import { defaultQueueOptions, redisConnection } from '../lib/queue.js';

export const commentQueueName = 'commentQueue';

export const commentQueue = new Queue(commentQueueName, {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultQueueOptions,
    delay: 500,
  },
});

// * Workers
export const handler = new Worker(
  commentQueueName,
  async (job: Job) => {
    const data = job.data;
    await prisma.clashComments.create({
      data: {
        comment: data?.comment,
        clash_id: Number(data?.id),
      },
    });
  },
  { connection: redisConnection }
);
