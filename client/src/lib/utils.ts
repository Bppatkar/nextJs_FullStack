import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Env from './env';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (img: string | undefined | null): string => {
  if (!img) {
    return '/banner_img.svg';
  }

  // If it's already a full URL, return it
  if (img.startsWith('http://') || img.startsWith('https://')) {
    return img;
  }

  let cleanPath = img.trim();
   if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }
  
  // Remove 'images/' prefix if present
  if (cleanPath.startsWith('images/')) {
    cleanPath = cleanPath.substring(7);
  }

  // Use Next.js rewrite to avoid CORS
  return `/api/images/${cleanPath}`;
};

export const checkDateExpiry = (date: string): boolean => {
  const currentDate = new Date();
  const givenDate = new Date(date);
  return givenDate < currentDate;
};
