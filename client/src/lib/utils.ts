import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Env from './env';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (img: string): string => {
  if (img.startsWith('http://') || img.startsWith('https://')) {
    return img;
  }

  let cleanPath = img;
  if (img.startsWith('/images/')) {
    cleanPath = img.replace('/images/', '');
  }

  return `${Env.BACKEND_URL}/images/${cleanPath}`;
};

export const checkDateExpiry = (date: string): boolean => {
  const currentDate = new Date();
  const givenDate = new Date(date);
  return givenDate < currentDate;
};
