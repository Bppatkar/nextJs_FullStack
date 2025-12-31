import express from 'express';
import type { Application, Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import ejs from 'ejs';
import { createServer, Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { initializeTransporter } from './lib/mail.js';
import Routes from './routes/index.js';
// * Set Queue
import './jobs/index.js';
import { setupSocket } from './sockets.js';
import { emailQueue, emailQueueName } from './jobs/EmailJob.js';
import { checkDateHourDifference } from './helper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Application = express();
const server: HttpServer = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
  },
});

export { io };
setupSocket(io);

const PORT = process.env.PORT || 7000;

app.use(
  cors({
    origin: ['http://localhost:3000', process.env.CLIENT_URL || '*'],
    credentials: false, // ✅ IMPORTANT: Set to false for file serving
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Content-Length'],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ EXPLICIT CORS MIDDLEWARE FOR IMAGES (runs after global CORS)
app.use('/images', (req, res, next) => {
  // Set explicit headers for image responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// ✅ STATIC FILES SERVING
app.use(
  '/images',
  express.static(path.join(process.cwd(), 'public', 'images'), {
    maxAge: '1h',
    etag: false,
    setHeaders: (res, filePath) => {
      // Set proper content-type
      if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
        res.setHeader('Content-Type', 'image/jpeg');
      } else if (filePath.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      } else if (filePath.endsWith('.gif')) {
        res.setHeader('Content-Type', 'image/gif');
      } else if (filePath.endsWith('.webp')) {
        res.setHeader('Content-Type', 'image/webp');
      }
      // Always set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
    },
  })
);

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './views'));

// Initialize email transporter
initializeTransporter()
  .then(() => console.log('✅ Email transporter initialized'))
  .catch((err) =>
    console.error('❌ Failed to initialize email transporter:', err)
  );

app.use(Routes);

// app.get('/', async (req: Request, res: Response) => {
//   try {
//     const html = await ejs.renderFile(__dirname + '/views/emails/welcome.ejs', {
//       name: 'new one',
//     });

//     if (!emailQueue) {
//       throw new Error('Email queue not initialized');
//     }

//     await emailQueue.add(emailQueueName, {
//       to: 'giyofap914@mekuron.com',
//       subject: 'checking with redis and typescript',
//       html: html,
//     });

//     const hoursDiff = checkDateHourDifference('2024-07-15T07:36:28.019Z');

//     return res.json({ message: 'Email sent successfully', hoursDiff });
//   } catch (error) {
//     console.error('Error in / route:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.get('/', (req: Request, res: Response) => {
return res.json({ message: 'Server is running', timestamp: new Date() });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
