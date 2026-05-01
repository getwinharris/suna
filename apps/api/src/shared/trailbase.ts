import { initClient, type Client } from 'trailbase';
import { config } from '../config';

let client: Client | null = null;

/**
 * Get singleton TrailBase client.
 */
export function getTrailbase(): Client {
  if (!client) {
    if (!config.TRAILBASE_URL) {
      throw new Error('Missing TRAILBASE_URL');
    }

    client = initClient(config.TRAILBASE_URL);
  }

  return client;
}

function decodeUserFromToken(token: string): { id: string; email?: string } | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const padded = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padding = (4 - (padded.length % 4)) % 4;
    const decoded = JSON.parse(atob(padded + '='.repeat(padding)));
    if (!decoded.sub) return null;

    return {
      id: decoded.sub,
      email: decoded.email || decoded.user_metadata?.email || '',
    };
  } catch {
    return null;
  }
}

/**
 * Validate a bearer token with TrailBase and return the token user.
 */
export async function getTrailbaseUser(token: string): Promise<{ id: string; email?: string } | null> {
  if (!config.TRAILBASE_URL) return null;

  const scopedClient = initClient(config.TRAILBASE_URL, {
    tokens: {
      auth_token: token,
      refresh_token: null,
      csrf_token: null,
    },
  });

  const status = await scopedClient.fetch('/api/auth/v1/status', {
    method: 'GET',
    throwOnError: false,
  });

  if (!status.ok) return null;
  return scopedClient.user() || decodeUserFromToken(token);
}

/**
 * Check if TrailBase is configured.
 */
export function isTrailbaseConfigured(): boolean {
  return !!config.TRAILBASE_URL;
}

/**
 * Helper to convert TrailBase record to a plain object.
 * TrailBase records often return blobs as Uint8Array, we convert to hex strings for UUIDs.
 */
export function fromTrailRecord<T>(record: any): T {
  if (!record) return record;
  const result: any = { ...record };
  
  // Convert Uint8Array (blobs) to hex strings if they look like UUIDs
  for (const [key, value] of Object.entries(result)) {
    if (value instanceof Uint8Array && value.length === 16) {
      result[key] = Array.from(value)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }
  }
  
  return result as T;
}

/**
 * Helper to convert UUID hex string to Uint8Array for TrailBase blobs.
 */
export function toTrailBlob(uuid: string): Uint8Array {
  if (!uuid) return new Uint8Array(0);
  const clean = uuid.replace(/-/g, '');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
  }
  return bytes;
}
