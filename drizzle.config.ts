import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// This manually loads your .env file
dotenv.config({ path: '.env' });

export default defineConfig({
  schema: './lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});