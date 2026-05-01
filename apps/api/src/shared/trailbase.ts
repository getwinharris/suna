import { config } from '../config';

const TRAILBASE_URL = config.TRAILBASE_URL?.replace(/\/+$/, '') || 'http://localhost:4000';

function trailFetch(path: string, options?: RequestInit) {
  return fetch(`${TRAILBASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
}

export function getTrailbase(): any {
  return {
    records: (tableName: string) => ({
      list: async (opts?: { pagination?: { limit?: number } }) => {
        const limit = opts?.pagination?.limit || 100;
        const res = await trailFetch(`/api/records/v1/${tableName}?limit=${limit}`);
        if (!res.ok) return { records: [] };
        return res.json();
      },
      create: async (data: any) => {
        const res = await trailFetch(`/api/records/v1/${tableName}`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!res.ok) return {};
        return res.json();
      },
      update: async (id: string, data: any) => {
        const res = await trailFetch(`/api/records/v1/${tableName}/${encodeURIComponent(id)}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });
        return res.ok;
      },
      delete: async (id: string) => {
        const res = await trailFetch(`/api/records/v1/${tableName}/${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
        return res.ok;
      },
    }),
    auth: {
      admin: {
        getUserById: async (userId: string) => {
          try {
            const payload = userId.split('.')[1];
            if (!payload) return { data: null, error: new Error('Invalid token') };
            const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
            return { data: { id: decoded.sub, email: decoded.email }, error: null };
          } catch {
            return { data: null, error: new Error('Invalid token') };
          }
        },
      },
    },
    login: async (email: string, password: string) => {
      const res = await trailFetch('/api/auth/v1/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    },
    user: () => null,
    tokens: () => null,
    logout: async () => true,
    refreshAuthToken: async () => undefined,
    fetch: async (path: string, opts?: any) => trailFetch(path, opts),
  };
}

export async function getTrailbaseUser(token: string): Promise<{ id: string; email?: string } | null> {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const padded = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padding = (4 - (padded.length % 4)) % 4;
    const decoded = JSON.parse(atob(padded + '='.repeat(padding)));
    if (!decoded.sub) return null;
    return { id: decoded.sub, email: decoded.email || '' };
  } catch {
    return null;
  }
}

export function isTrailbaseConfigured(): boolean {
  return !!config.TRAILBASE_URL;
}

export function fromTrailRecord<T>(record: any): T {
  if (!record) return record;
  const result: any = { ...record };
  for (const [key, value] of Object.entries(result)) {
    if (value instanceof Uint8Array && value.length === 16) {
      result[key] = Array.from(value).map(b => b.toString(16).padStart(2, '0')).join('');
    }
  }
  return result as T;
}

export function toTrailBlob(uuid: string): Uint8Array {
  if (!uuid) return new Uint8Array(0);
  const clean = uuid.replace(/-/g, '');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
  }
  return bytes;
}
