import type { Config } from 'drizzle-kit';

const isProduction = process.env.NODE_ENV === 'production';
const useSQLite = !isProduction || process.env.USE_SQLITE === 'true';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: useSQLite ? 'sqlite' : 'postgresql',
  dbCredentials: useSQLite
    ? {
        url: process.env.DATABASE_PATH || 'local.db',
      }
    : {
        url: process.env.DATABASE_URL || '',
      },
} satisfies Config;
