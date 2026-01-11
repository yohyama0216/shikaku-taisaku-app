import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import Database from 'better-sqlite3';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const isProduction = process.env.NODE_ENV === 'production';
const useSQLite = !isProduction || process.env.USE_SQLITE === 'true';

let dbInstance: ReturnType<typeof drizzleSQLite> | ReturnType<typeof drizzleNeon> | null = null;

export function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  if (useSQLite) {
    // SQLite for local development
    const sqliteDb = new Database(process.env.DATABASE_PATH || 'local.db');
    dbInstance = drizzleSQLite(sqliteDb, { schema });
  } else {
    // Neon PostgreSQL for production
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required for production');
    }
    const sql = neon(process.env.DATABASE_URL);
    dbInstance = drizzleNeon(sql, { schema });
  }

  return dbInstance;
}

export const db = getDb();
