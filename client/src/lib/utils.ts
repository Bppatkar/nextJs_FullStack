import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (img: string): string => {
  if (img.startsWith('http')) {
    return img;
  }

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  // return `${backendUrl}/images/${img}`;
  return `/api/images/${img}`;
};

export const checkDateExpiry = (date: string): boolean => {
  const currentDate = new Date();
  const givenDate = new Date(date);
  return givenDate < currentDate;
};
