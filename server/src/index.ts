import express from 'express';
import type { Application, Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
const _dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Application = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//  setting View engine ejs
app.set('view engine', 'ejs');
app.set('views', path.resolve(_dirname, './views'));

app.get('/', (req: Request, res: Response) => {
  return res.render('welcome');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
