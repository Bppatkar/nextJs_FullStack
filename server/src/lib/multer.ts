import multer from 'multer';
import path from 'path';
import { generateRandomNum } from '../helper.js';
import { Request } from 'express';
import { supportedMimes } from './filesystem.js';

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const uploadPath = path.join(process.cwd(), 'public', 'images');
    cb(null, uploadPath);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const uniqueName = generateRandomNum();
    const ext = path.extname(file.originalname);
    cb(null, ` ${uniqueName}${ext}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = supportedMimes;

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invaild file type. only images are allowed'));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
    files: 10, // max 10 files
  },
});

export const singleUpload = upload.single('image');
export const multipleUpload = upload.array('images');
export const clashItemsUpload = upload.array('images[]'); 
export const fieldsUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 10 },
]);
