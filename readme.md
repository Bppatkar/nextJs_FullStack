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

