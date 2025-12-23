import express from 'express';
import type { Application, Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { initializeTransporter } from './lib/mail.js';
import Routes from './routes/index.js';

const _dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Application = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//  setting View engine ejs
app.set('view engine', 'ejs');
app.set('views', path.resolve(_dirname, './views'));

// Initialize email transporter BEFORE routes
initializeTransporter()
  .then(() => console.log('✅ Email transporter initialized'))
  .catch((err) =>
    console.error('❌ Failed to initialize email transporter:', err)
  );

app.use(Routes);

app.get('/', async (req: Request, res: Response) => {
  const html = await ejs.renderFile(_dirname + '/views/emails/welcome.ejs', {
    name: 'new one',
  });
  // await sendEmail('jihov40461@mucate.com', 'new one for more testing', html);

  await emailQueue.add(emailQueueName, {
    to: 'giyofap914@mekuron.com',
    subject: 'checking with redis and typescript',
    html: html,
  });
  return res.json({ message: 'Email send successfully' });
});

import './jobs/index.js';
import { emailQueue, emailQueueName } from './jobs/EmailJob.js';
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
