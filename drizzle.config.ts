import { resolve } from 'node:path';
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Load environment variables from .env.local (for local development) or .env file
config({ path: resolve(__dirname, '.env.local') });
config({ path: resolve(__dirname, '.env') });

export default defineConfig({
  out: './migrations',
  schema: './src/models/Schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  verbose: true,
  strict: true,
});
