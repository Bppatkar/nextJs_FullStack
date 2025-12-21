import { ZodError } from 'zod';
import { supportedMimes } from './lib/filesystem.js';
import { v4 as uuidv4 } from 'uuid';
import ejs from 'ejs';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as path from 'path';
import moment from 'moment';

export const formatError = (error: ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};

  error.issues.forEach((issue) => {
    if (issue.path[0]) {
      const fieldName = issue.path[0] as string;
      errors[fieldName] = issue.message;
    }
  });

  return errors;
};

export const imageValidator = (size: number, mime: string): string | null => {
  if (bytesToMb(size) > 2) {
    return 'Image size must be less than 2 MB';
  } else if (!supportedMimes.includes(mime)) {
    return 'Image must be type of png, jpg, jpeg,svg, webp,gif..';
  }
  return null;
};

export const bytesToMb = (bytes: number) => {
  return bytes / (1024 * 1024);
};

export const generateRandomNum = () => {
  return uuidv4();
};

export const removeImage = (imageName: string): boolean => {
  const imagePath = path.join(process.cwd(), 'public', 'images', imageName);

  if (fs.existsSync(imagePath))
    try {
      fs.unlinkSync(imagePath);
      return true;
    } catch (error) {
      console.error('Error removing image:', error);
      return false;
    }

  return false;
};

export const getImageUrl = (imageName: string): string => {
  return `images/${imageName}`;
};

export const processUploadedFile = (file: Express.Multer.File) => {
  return {
    filename: file.filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path,
    url: getImageUrl(file.filename),
  };
};

export const uploadImage = async (
  file: Express.Multer.File
): Promise<string> => {
  const error = imageValidator(file.size, file.mimetype);
  if (error) {
    throw new Error(error);
  }

  const ext = path.extname(file.originalname);
  const filename = `${generateRandomNum()}${ext}`;
  const uploadPath = path.join(process.cwd(), 'public', 'images', filename);

  await fs.promises.writeFile(uploadPath, file.buffer);
  return filename;
};

export const renderEmailEjs = async (fileName: string, payload: any) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templatePath = path.join(
    __dirname,
    'views',
    'emails',
    `${fileName}.ejs`
  );
  if (!fs.existsSync(templatePath)) {
    const rootPath = path.join(
      process.cwd(),
      'src',
      'views',
      'emails',
      `${fileName}.ejs`
    );
    if (!fs.existsSync(rootPath)) {
      throw new Error(`Email template not found: ${fileName}.ejs`);
    }
  }
  const html = await ejs.renderFile(templatePath, payload);
  return html;
};

export const checkDateHourDifference = (date: Date | string): number => {
  const now = moment();
  const tokenSentAt = moment(date);
  const difference = moment.duration(now.diff(tokenSentAt));
  return difference.asHours();
};
