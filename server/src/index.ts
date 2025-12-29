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

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  '/images',
  express.static(path.join(process.cwd(), 'public', 'images'))
);
app.use(express.static('public'));

//  setting View engine ejs
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './views'));

// Initialize email transporter BEFORE routes
initializeTransporter()
  .then(() => console.log('✅ Email transporter initialized'))
  .catch((err) =>
    console.error('❌ Failed to initialize email transporter:', err)
  );

app.use(Routes);

app.get('/', async (req: Request, res: Response) => {
  try {
    const html = await ejs.renderFile(__dirname + '/views/emails/welcome.ejs', {
      name: 'new one',
    });

    // Check if emailQueue is properly initialized
    if (!emailQueue) {
      throw new Error('Email queue not initialized');
    }

    await emailQueue.add(emailQueueName, {
      to: 'giyofap914@mekuron.com',
      subject: 'checking with redis and typescript',
      html: html,
    });

    const hoursDiff = checkDateHourDifference('2024-07-15T07:36:28.019Z');

    return res.json({ message: 'Email sent successfully', hoursDiff });
  } catch (error) {
    console.error('Error in / route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
