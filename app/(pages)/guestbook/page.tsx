import { db } from '@/lib/db';
import { guestbook } from '@/lib/schema';
import { desc } from 'drizzle-orm';
import GuestbookClient from '@/components/guestbook-client';

export default async function Page() {
  const entries = await db.select().from(guestbook).orderBy(desc(guestbook.createdAt));
  return <GuestbookClient initialEntries={entries} />;
}