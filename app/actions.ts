'use server';

import { db } from '@/lib/db';
import { guestbook } from '@/lib/schema';
import { revalidatePath } from 'next/cache';

export async function addEntry(name: string, message: string) {
  if (!name || !message) return { error: "Fields required" };

  await db.insert(guestbook).values({ name, message });
  
  // This tells Next.js to refresh the data on the page
  revalidatePath('/guestbook'); 
  return { success: true };
}