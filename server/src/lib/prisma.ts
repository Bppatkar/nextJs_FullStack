import dotenv from 'dotenv';
dotenv.config();

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

const connectionString = `${process.env.DATABASE_URL}` as string;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in .env file');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
  log: ['query', 'error'],
  errorFormat: 'pretty',
  adapter,
});

prisma
  .$connect()
  .then(() => console.log('✅ Database connected'))
  .catch((err: any) =>
    console.error('❌ Database connection failed:', err.message)
  );

export default prisma;
