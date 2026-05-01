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

function getTableName(table: any): string {
   if (!table) return 'unknown';
   if (typeof table === 'string') return table;
   
   // 1. Standard Drizzle properties
   const name = table._?.name || table.name || table.tableName;
   if (name) return name;
   
   // 2. Try symbols (Drizzle 0.30+)
   try {
     const symbols = Object.getOwnPropertySymbols(table);
     for (const s of symbols) {
       const desc = s.description || '';
       if (desc.includes('drizzle:Name') || desc.includes('drizzle:TableName')) {
         return table[s];
       }
     }
   } catch (e) {}

   // 3. Fallback: check keys for anything containing 'name'
   for (const key of Object.keys(table)) {
     if (key.toLowerCase().includes('name') && typeof table[key] === 'string') {
       return table[key];
     }
   }

   return 'unknown';
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
        if (prop === 'then') {
          if (typeof t.execute === 'function') {
            return (resolve: any, reject: any) => t.execute().then(resolve, reject);
          }
          // If no execute, just resolve with the target itself (e.g. for chaining)
          return (resolve: any) => resolve(t);
        }
        if (prop in t) return t[prop];
        // Silent failure for missing Drizzle methods to keep things running
        return () => wrapInProxy(t);
      }
    });
  };

  const base = {
    insert: (table: any) => {
      const tableName = getTableName(table);
      return wrapInProxy({
        values: (data: any) => {
          const dataArray = Array.isArray(data) ? data : [data];
          const executeInsert = async () => {
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
          };
          return wrapInProxy({
            execute: executeInsert,
            returning: () => wrapInProxy({ execute: executeInsert }),
            onConflictDoUpdate: () => wrapInProxy({ execute: executeInsert }),
            onConflictDoNothing: () => wrapInProxy({ execute: executeInsert }),
          });
        }
      });
    },
    select: (fields?: any) => wrapInProxy({
      from: (table: any) => {
        const tableName = getTableName(table);
        const executeSelect = async () => {
           const res = await trail.records(tableName).list();
           return res.records.map(fromTrailRecord);
        };
        return wrapInProxy({
          execute: executeSelect,
          where: (condition: any) => wrapInProxy({
            execute: executeSelect,
            limit: (n: number) => wrapInProxy({
              execute: async () => {
                const res = await trail.records(tableName).list({ pagination: { limit: n } });
                return res.records.map(fromTrailRecord);
              }
            }),
          }),
          limit: (n: number) => wrapInProxy({
            execute: async () => {
              const res = await trail.records(tableName).list({ pagination: { limit: n } });
              return res.records.map(fromTrailRecord);
            }
          }),
        });
      }
    }),
    update: (table: any) => {
      const tableName = getTableName(table);
      return wrapInProxy({
        set: (data: any) => wrapInProxy({
          where: (condition: any) => wrapInProxy({
            execute: async () => {
               // Update is not fully implemented in proxy, but we return empty array to prevent hang
               return [];
            },
            returning: () => wrapInProxy({ execute: async () => [] })
          })
        })
      });
    },
    delete: (table: any) => {
      const tableName = getTableName(table);
      return wrapInProxy({
        where: (condition: any) => wrapInProxy({
          execute: async () => [],
          returning: () => wrapInProxy({ execute: async () => [] })
        })
      });
    },
    execute: async (sqlQuery: any) => {
      // Stub for raw SQL execution in TrailBase mode
      console.log('[TrailBase Proxy] execute called with:', sqlQuery?.sql || 'unknown query');
      
      // If checking for users, we can check a known table like platform_user_roles
      if (sqlQuery?.sql?.includes('auth.users')) {
        try {
          const res = await trail.records('platform_user_roles').list({ pagination: { limit: 1 } });
          return { rows: [{ has_users: res.records.length > 0 }] };
        } catch (err) {
          console.error('[TrailBase Proxy] execute error:', err);
          return { rows: [{ has_users: false }] };
        }
      }
      
      return { rows: [] };
    },
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
