import { Job, Queue, Worker } from 'bullmq';
import { defaultQueueOptions, redisConnection } from '../lib/queue.js';
import { sendEmail } from '../lib/mail.js';

export const emailQueueName = 'emailQueue';

interface EmailJobDataType {
  to: string;
  subject: string;
   html: string;
}

export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueOptions,
});

export const queueWorker = new Worker(
  emailQueueName,
  async (job: Job) => {
    const data: EmailJobDataType = job.data;
    await sendEmail(data.to, data.subject, data.html);
  },
  { connection: redisConnection }
);
