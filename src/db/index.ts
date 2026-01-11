import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import Database from 'better-sqlite3';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const isProduction = process.env.NODE_ENV === 'production';
const useSQLite = !isProduction || process.env.USE_SQLITE === 'true';

let dbInstance: ReturnType<typeof drizzleSQLite> | null = null;

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
      // During build time, create a dummy instance that won't be used
      // The actual database connection will be established at runtime
      console.warn('DATABASE_URL not set, creating placeholder DB instance for build');
      const sqliteDb = new Database(':memory:');
      dbInstance = drizzleSQLite(sqliteDb, { schema });
    } else {
      const sql = neon(process.env.DATABASE_URL);
      // Type assertion to treat Neon as SQLite for type compatibility
      dbInstance = drizzleNeon(sql, { schema }) as any as ReturnType<typeof drizzleSQLite>;
    }
  }

  return dbInstance;
}

export const db = getDb();
