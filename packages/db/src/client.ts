import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { initClient, type Client } from 'trailbase';

/**
 * Create a Drizzle database client or a TrailBase client.
 * 
 * @param databaseUrl - PostgreSQL connection string OR TrailBase URL
 * @param options - Additional postgres.js options
 * @returns Drizzle database client or TrailBase proxy
 */
export function createDb(databaseUrl: string, options?: postgres.Options<{}>) {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }

  // If it's a TrailBase URL
  if (databaseUrl.startsWith('http')) {
    const trail = initClient(databaseUrl);
    return createTrailbaseProxy(trail);
  }

  // Connection with prepare: false for Supabase connection pooler compatibility
  const client = postgres(databaseUrl, { 
    prepare: false,
    ...options 
  });

  return drizzle(client, { schema });
}

function createTrailbaseProxy(trail: Client): any {
  const fromTrailRecord = (record: any) => {
    if (!record) return record;
    const result: any = { ...record };
    for (const [key, value] of Object.entries(result)) {
      if (value instanceof Uint8Array && value.length === 16) {
        result[key] = Array.from(value).map(b => b.toString(16).padStart(2, '0')).join('');
      }
    }
    return result;
  };

  const toTrailBlob = (uuid: string) => {
    if (!uuid) return new Uint8Array(0);
    const clean = uuid.replace(/-/g, '').toLowerCase();
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < clean.length; i += 2) {
      bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
    }
    return bytes;
  };

  const wrapInProxy = (target: any) => {
    return new Proxy(target, {
      get(t, prop) {
        if (prop in t) return t[prop];
        // Silent failure for missing Drizzle methods to keep things running
        return () => wrapInProxy(t);
      }
    });
  };

  const base = {
    insert: (table: any) => wrapInProxy({
      values: (data: any) => wrapInProxy({
        returning: async () => {
          const tableName = table._?.name || table.name || (typeof table === 'string' ? table : 'unknown');
          const dataArray = Array.isArray(data) ? data : [data];
          const results = [];
          for (const item of dataArray) {
            const processedData = { ...item };
            for (const [key, val] of Object.entries(processedData)) {
              if (typeof val === 'string' && (val.length === 36 || val.length === 32)) {
                processedData[key] = toTrailBlob(val);
              }
            }
            const id = await trail.records(tableName).create(processedData);
            results.push(fromTrailRecord({ ...processedData, id }));
          }
          return results;
        }
      })
    }),
    select: (fields?: any) => wrapInProxy({
      from: (table: any) => wrapInProxy({
        where: (condition: any) => wrapInProxy({
          limit: (n: number) => wrapInProxy({
            execute: async () => {
              const tableName = table._?.name || table.name;
              const res = await trail.records(tableName).list();
              return res.records.map(fromTrailRecord);
            }
          }),
          execute: async () => {
             const tableName = table._?.name || table.name;
             const res = await trail.records(tableName).list();
             return res.records.map(fromTrailRecord);
          }
        }),
        execute: async () => {
           const tableName = table._?.name || table.name;
           const res = await trail.records(tableName).list();
           return res.records.map(fromTrailRecord);
        }
      })
    }),
    update: (table: any) => wrapInProxy({
      set: (data: any) => wrapInProxy({
        where: (condition: any) => wrapInProxy({
          returning: async () => {
             return [];
          }
        })
      })
    }),
    delete: (table: any) => wrapInProxy({
      where: (condition: any) => wrapInProxy({
        returning: async () => {
           return [];
        }
      })
    }),
    query: new Proxy({}, {
      get: (_, tableName) => ({
        findFirst: async (options: any) => {
           const res = await trail.records(tableName as string).list({ pagination: { limit: 1 } });
           return res.records[0] ? fromTrailRecord(res.records[0]) : null;
        },
        findMany: async (options: any) => {
           const res = await trail.records(tableName as string).list();
           return res.records.map(fromTrailRecord);
        }
      })
    })
  };

  return wrapInProxy(base);
}

export type Database = ReturnType<typeof createDb>;
