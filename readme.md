# Next JS FullStack Project

## This is project where i am using
- PostgreSQL, Typescript, Redis, Queue, Socket.IO and of course Next JS


# Prisma 7 + PostgreSQL Complete Setup Guide

> Day 140: Finally cracked Prisma 7.0 + PostgreSQL setup 🔥

## Overview

This guide walks through setting up **Prisma 7.0** with **PostgreSQL** using the new `@prisma/adapter-pg` driver adapter. The v7 migration introduces breaking changes—config structure, imports, and adapter requirements all changed. This README covers everything you need.

---

## Step 1: Install Dependencies

Install Prisma 7, the PostgreSQL adapter, and the native driver:

```bash
npm install -D prisma@7
npm install @prisma/client@7 @prisma/adapter-pg@7 pg dotenv
```

**What each package does:**
- `prisma@7` — CLI and migration tools
- `@prisma/client@7` — The ORM client
- `@prisma/adapter-pg@7` — PostgreSQL driver adapter (NEW in v7, REQUIRED)
- `pg` — Native PostgreSQL driver
- `dotenv` — Environment variable management

---

## Step 2: Initialize Prisma

Run the initialization command:

```bash
npx prisma@7 init
```

This creates a `prisma` folder with default files. **Important:** If it generates `prisma.config.ts`, rename it to `prisma.config.mjs` immediately (we're using JavaScript).

---

## Step 3: Create prisma.config.mjs

In Prisma 7, the database connection URL moves **out of schema.prisma** and **into a dedicated config file**.

Create or update `prisma/prisma.config.mjs`:

```javascript
import { defineConfig, env } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // DATABASE_URL is defined HERE in v7, NOT in schema.prisma
    url: env('DATABASE_URL'),
  },
});
```

---

## Step 4: Update prisma/schema.prisma

Open `prisma/schema.prisma` and make two critical changes for v7:

1. Remove the `url` from the `datasource` block (it's now in `prisma.config.mjs`)
2. Add a custom `output` path to the `generator` block

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  // URL is handled in prisma.config.mjs (NOT here in v7)
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  createdAt DateTime @default(now())
}
```

---

## Step 5: Set Environment Variables

Create or update your `.env` file:

```env
DATABASE_URL="postgres://user:password@localhost:5432/mydb"
```

Replace `user`, `password`, `localhost`, `5432`, and `mydb` with your PostgreSQL connection details.

---

## Step 6: Generate and Migrate

Generate the Prisma client and run migrations:

```bash
npx prisma@7 migrate dev --name init
```

This creates:
- Migration files in `prisma/migrations/`
- Generated client in `generated/prisma/` (based on your schema)

---

## Step 7: Create the Singleton Client (lib/prisma.js)

This is the **critical step** where most developers fail with Prisma 7 + Next.js.

Create `lib/prisma.js`:

```javascript
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const pool = new PrismaClient({ adapter });

export default pool;
```

**Why this matters:**
- Import from `../generated/prisma/client.js` (matches your `output` path in schema)
- Pass the `PrismaPg` adapter when instantiating `PrismaClient`
- Singleton pattern prevents duplicate connections and hot-reload crashes

---

## Step 8: Usage in Next.js (Server Component)

Now import and use the singleton in your app:

```javascript
import prisma from '@/lib/prisma';

export default async function Home() {
  const users = await prisma.user.findMany();

  return (
    <main>
      <h1>All Users</h1>
      {users.map((user) => (
        <div key={user.id}>
          <p>{user.name} - {user.email}</p>
        </div>
      ))}
    </main>
  );
}
```

---

## Key Breaking Changes in Prisma 7

| Change | Details |
|--------|---------|
| **Config File** | `prisma.config.mjs` is now MANDATORY |
| **Environment Variable** | `DATABASE_URL` moves OUT of `schema.prisma` |
| **Import Path** | Import from `../generated/prisma/client.js` (not `client/index.js`) |
| **Adapter** | `PrismaPg` adapter is REQUIRED for PostgreSQL |
| **Connection** | Pass `adapter` to `new PrismaClient({ adapter })` |

---

## Troubleshooting

**Problem:** `PrismaClient is not defined` or import errors

**Solution:** Check your import path matches your `output` setting in `schema.prisma`

---

**Problem:** Connection pooling issues

**Solution:** Ensure you're using the singleton pattern and not creating multiple `PrismaClient` instances

---

**Problem:** Hot-reload crashes in development

**Solution:** The global object handling in `lib/prisma.js` prevents this—make sure it's there

---

# Email Service Setup with Nodemailer & MailerSend

## Overview

This section covers integrating **Nodemailer** with **MailerSend** (or any SMTP provider) to send emails from your Next.js application.

---

## Step 1: Install Dependencies

```bash
npm install nodemailer ejs
npm install -D @types/nodemailer @types/ejs
```

**What each package does:**
- `nodemailer` — Email sending library
- `ejs` — Template engine for rendering email HTML
- `@types/*` — TypeScript definitions for type safety

---

## Step 2: Configure Environment Variables

Add the following to your `.env` file:

```env
SMTP_HOST=smtp.mailersend.net
SMTP_PORT=587
SMTP_USER=your_mailersend_user@example.com
SMTP_PASS=your_mailersend_password

FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Your App Name
```

**Where to find these:**
- **MailerSend:** Get SMTP credentials from your MailerSend dashboard
- **Gmail:** Use an App Password (enable 2FA first)
- **Other providers:** Check their SMTP settings documentation

---

## Step 3: Create Email Service (lib/email.ts)

Create `lib/email.ts` with the Nodemailer transporter:

```typescript
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailersend.net',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  try {
    const fromEmail = process.env.FROM_EMAIL;
    const fromName = process.env.FROM_NAME || 'Your App';

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: to,
      subject: subject,
      html: html,
    });

    console.log('✅ Email sent successfully!');
    console.log('📨 Message ID:', info.messageId);
    console.log('📊 Response:', info.response);
  } catch (error: any) {
    console.error('❌ Email sending error:', error.message);

    if (error.response) {
      console.log('Response:', error.response);
    }
    throw error;
  }
};
```

---

## Step 4: Create Email Templates

Create `views/emails/welcome.ejs`:

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; }
      .header { background-color: #007bff; color: white; padding: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome, <%= name %>!</h1>
      </div>
      <p>Thank you for joining us. We're excited to have you on board!</p>
    </div>
  </body>
</html>
```

---

## Step 5: Use in Next.js API Route

Create `app/api/send-email/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import ejs from 'ejs';
import path from 'path';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    // Render the email template
    const templatePath = path.join(process.cwd(), 'views/emails/welcome.ejs');
    const html = await ejs.renderFile(templatePath, { name });

    // Send the email
    await sendEmail(email, 'Welcome to Our App!', html);

    return NextResponse.json(
      { message: 'Email sent successfully!' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

**Usage example:**

```typescript
// In a client or server component
const response = await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'Anurag Patkar'
  })
});
```

---

## Troubleshooting Email Issues

**Problem:** "Invalid login" or authentication error

**Solution:** Verify SMTP credentials are correct and App Passwords are enabled (for Gmail)

---

**Problem:** Emails sent but not received

**Solution:** Check spam folder, verify FROM_EMAIL is authorized in your mail service

---

**Problem:** Template rendering errors

**Solution:** Ensure file path is correct and EJS template syntax is valid

---

# Redis Installation & Setup

## Overview

**Redis** is an in-memory data structure store used for caching, sessions, queues, and real-time features in your Next.js application.

---

## Step 1: Install Redis

### Windows (MSI Installer)

1. Download the latest Redis MSI installer from [GitHub Releases](https://github.com/microsoftarchive/redis/releases)
2. Run the installer and follow the setup wizard
3. Choose installation directory (default: `C:\Program Files\Redis`)
4. Check "Add Redis to PATH" during installation
5. Redis will be installed as a Windows service and start automatically

### Verify Installation

Open Command Prompt and run:

```bash
redis-cli --version
```

You should see the Redis version number.

---

## Step 2: Manage Redis Service (Windows)

### Start Redis

Redis typically starts automatically as a Windows service after installation. To manually start it, open Command Prompt as Administrator:

```bash
redis-server
```

Or if you want to start the Redis service specifically:

```bash
net start Redis
```

### Stop Redis

To stop the Redis service, run in Command Prompt as Administrator:

```bash
net stop Redis
```

### Verify Redis is Running

Check if Redis is running and responding:

```bash
redis-cli ping
```

If Redis is running, you'll see:

```
PONG
```

### Other Useful Commands

**Check Redis info:**

```bash
redis-cli info
```

**List all keys in Redis:**

```bash
redis-cli keys *
```

**Access Redis CLI directly:**

```bash
redis-cli
```

This opens the Redis command line interface where you can run commands directly.

---

## Step 3: Install Node.js Redis Client

Add the Redis client to your project:

```bash
npm install redis
npm install -D @types/redis
```

---

## Step 4: Create Redis Connection (lib/redis.ts)

Create `lib/redis.ts`:

```typescript
import { createClient } from 'redis';

const client = createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
});

client.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

client.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

export const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
};

export default client;
```

---

## Step 5: Add Redis Environment Variables

Update your `.env` file:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

---

## Step 6: Usage Examples

### Example 1: Simple Cache

```typescript
import client, { connectRedis } from '@/lib/redis';

export async function getCachedUser(userId: string) {
  await connectRedis();

  // Try to get from cache
  const cached = await client.get(`user:${userId}`);
  if (cached) {
    console.log('📦 Retrieved from cache');
    return JSON.parse(cached);
  }

  // If not in cache, fetch from database
  const user = await prisma.user.findUnique({ where: { id: userId } });

  // Store in cache for 1 hour (3600 seconds)
  if (user) {
    await client.setEx(`user:${userId}`, 3600, JSON.stringify(user));
  }

  return user;
}
```

### Example 2: Session Storage

```typescript
import client, { connectRedis } from '@/lib/redis';

export async function storeSession(sessionId: string, userData: any) {
  await connectRedis();
  
  // Store session data for 24 hours
  await client.setEx(
    `session:${sessionId}`,
    86400,
    JSON.stringify(userData)
  );
}

export async function getSession(sessionId: string) {
  await connectRedis();
  
  const sessionData = await client.get(`session:${sessionId}`);
  return sessionData ? JSON.parse(sessionData) : null;
}
```

### Example 3: Rate Limiting

```typescript
import client, { connectRedis } from '@/lib/redis';

export async function checkRateLimit(userId: string, limit: number = 10, windowSeconds: number = 60) {
  await connectRedis();
  
  const key = `ratelimit:${userId}`;
  const count = await client.incr(key);

  if (count === 1) {
    // First request in this window, set expiration
    await client.expire(key, windowSeconds);
  }

  return count <= limit;
}
```

---

## Common Redis Commands

| Command | Description |
|---------|-------------|
| `PING` | Check if Redis is running |
| `SET key value` | Store a value |
| `GET key` | Retrieve a value |
| `DEL key` | Delete a key |
| `EXISTS key` | Check if key exists |
| `EXPIRE key seconds` | Set key expiration time |
| `FLUSHALL` | Clear all data (use with caution!) |

---

## Troubleshooting Redis

**Problem:** "Connection refused" error

**Solution:** Verify Redis service is running by checking Windows Services or running `redis-cli ping`

---

**Problem:** Cannot connect to localhost:6379

**Solution:** Check `REDIS_HOST` and `REDIS_PORT` in `.env` file match your Redis configuration

---

**Problem:** Redis commands not working in Node.js

**Solution:** Ensure you call `connectRedis()` before executing commands