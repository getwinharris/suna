import { createDb, type Database } from '@bapx/db';
import { config } from '../config';

/**
 * Database availability flag.
 * Check this before importing any DB-dependent modules.
 */
export const hasDatabase: boolean = !!config.DATABASE_URL || !!config.TRAILBASE_URL;

/**
 * Database connection.
 *
 * In local mode without DATABASE_URL, this falls back to TRAILBASE_URL.
 */
export const db: Database = config.DATABASE_URL
  ? createDb(config.DATABASE_URL)
  : (config.TRAILBASE_URL
      ? createDb(config.TRAILBASE_URL)
      : (new Proxy({} as Database, {
          get(_, prop) {
            throw new Error(
              `Neither DATABASE_URL nor TRAILBASE_URL is configured. Cannot access db.${String(prop)}.`,
            );
          },
        }) as Database));
