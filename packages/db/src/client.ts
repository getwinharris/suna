import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const TRAILBASE_URL = process.env.TRAILBASE_URL || 'http://localhost:4000';

function getTableName(table: any): string {
   if (!table) return 'unknown';
   if (typeof table === 'string') return table;
   const name = table._?.name || table.name || table.tableName;
   if (name) return name;
   try {
     const symbols = Object.getOwnPropertySymbols(table);
     for (const s of symbols) {
       const desc = s.description || '';
       if (desc.includes('drizzle:Name') || desc.includes('drizzle:TableName')) {
         return table[s];
       }
     }
   } catch (e) {}
   for (const key of Object.keys(table)) {
     if (key.toLowerCase().includes('name') && typeof table[key] === 'string') {
       return table[key];
     }
   }
   return 'unknown';
}

function trailFetch(path: string, options?: RequestInit) {
  const url = `${TRAILBASE_URL}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
}

export function createDb(databaseUrl: string, options?: postgres.Options<{}>) {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }

  if (databaseUrl.startsWith('http')) {
    return createTrailbaseProxy();
  }

  const client = postgres(databaseUrl, {
    prepare: false,
    ...options
  });

  return drizzle(client, { schema });
}

function wrapInProxy(target: any) {
  return new Proxy(target, {
    get(t, prop) {
      if (prop === 'then') {
        if (typeof t.execute === 'function') {
          return (resolve: any, reject: any) => t.execute().then(resolve, reject);
        }
        return (resolve: any) => resolve(t);
      }
      if (prop in t) return t[prop];
      return () => wrapInProxy(t);
    }
  });
}

function createTrailbaseProxy(): any {
  const base = {
    insert: (table: any) => {
      const tableName = getTableName(table);
      return wrapInProxy({
        values: (data: any) => {
          const dataArray = Array.isArray(data) ? data : [data];
          const executeInsert = async () => {
            const results = [];
            for (const item of dataArray) {
              const res = await trailFetch(`/api/records/v1/${tableName}`, {
                method: 'POST',
                body: JSON.stringify(item),
              });
              if (res.ok) {
                const body = await res.json();
                results.push(body);
              } else {
                console.error(`[TrailBase] INSERT ${tableName} failed:`, res.status, await res.text());
              }
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
    select: () => wrapInProxy({
      from: (table: any) => {
        const tableName = getTableName(table);
        return wrapInProxy({
          execute: async () => {
            const res = await trailFetch(`/api/records/v1/${tableName}`);
            if (!res.ok) {
              console.error(`[TrailBase] SELECT ${tableName} failed:`, res.status);
              return [];
            }
            const body = await res.json();
            return body.records || [];
          },
          where: () => wrapInProxy({
            execute: async () => {
              const res = await trailFetch(`/api/records/v1/${tableName}`);
              if (!res.ok) return [];
              const body = await res.json();
              return body.records || [];
            },
            limit: (n: number) => wrapInProxy({
              execute: async () => {
                const res = await trailFetch(`/api/records/v1/${tableName}?limit=${n}`);
                if (!res.ok) return [];
                const body = await res.json();
                return body.records || [];
              }
            }),
          }),
          limit: (n: number) => wrapInProxy({
            execute: async () => {
              const res = await trailFetch(`/api/records/v1/${tableName}?limit=${n}`);
              if (!res.ok) return [];
              const body = await res.json();
              return body.records || [];
            }
          }),
        });
      }
    }),
    update: (table: any) => {
      return wrapInProxy({
        set: (data: any) => wrapInProxy({
          where: () => wrapInProxy({
            execute: async () => [],
            returning: () => wrapInProxy({ execute: async () => [] })
          })
        })
      });
    },
    delete: (table: any) => {
      return wrapInProxy({
        where: () => wrapInProxy({
          execute: async () => [],
          returning: () => wrapInProxy({ execute: async () => [] })
        })
      });
    },
    execute: async (sqlQuery: any) => {
      if (sqlQuery?.sql?.includes('auth.users')) {
        const res = await trailFetch('/api/records/v1/accounts?limit=1');
        return { rows: [{ has_users: res.ok }] };
      }
      return { rows: [] };
    },
    query: new Proxy({}, {
      get: (_, tableName) => ({
        findFirst: async () => {
          const res = await trailFetch(`/api/records/v1/${tableName as string}?limit=1`);
          if (!res.ok) return null;
          const body = await res.json();
          return body.records?.[0] || null;
        },
        findMany: async () => {
          const res = await trailFetch(`/api/records/v1/${tableName as string}`);
          if (!res.ok) return [];
          const body = await res.json();
          return body.records || [];
        }
      })
    })
  };

  return wrapInProxy(base);
}

export type Database = ReturnType<typeof createDb>;
