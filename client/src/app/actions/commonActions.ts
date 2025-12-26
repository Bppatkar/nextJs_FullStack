'use server';
import { revalidatePath } from 'next/cache';

export async function clearCache(tag: string) {
  try {
     revalidatePath('/dashboard');
  } catch (error) {
    console.error('Cache revalidation error:', error);
  }
}