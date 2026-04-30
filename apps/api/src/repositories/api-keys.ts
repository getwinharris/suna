import { eq, and } from 'drizzle-orm';
import { bapxApiKeys } from '@bapx/db';
import { db } from '../shared/db';
import {
  hashSecretKey,
  generateApiKeyPair,
  generateSandboxKeyPair,
  isApiKeySecretConfigured,
  isBapxToken,
} from '../shared/crypto';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ApiKeyType = 'user' | 'sandbox';

export interface ApiKeyValidationResult {
  isValid: boolean;
  accountId?: string;
  sandboxId?: string;
  keyId?: string;
  type?: ApiKeyType;
  error?: string;
}

export interface CreateApiKeyParams {
  sandboxId: string;
  accountId: string;
  title: string;
  description?: string;
  expiresAt?: Date;
  type?: ApiKeyType;
}

export interface CreateApiKeyResult {
  keyId: string;
  publicKey: string;
  secretKey: string; // returned ONCE at creation, never stored
  title: string;
  description: string | null;
  status: string;
  type: ApiKeyType;
  sandboxId: string;
  expiresAt: Date | null;
  createdAt: Date;
}

// ─── Throttle for last_used_at updates ───────────────────────────────────────

const THROTTLE_MS = 15 * 60 * 1000;
const lastUsedCache = new Map<string, number>();

// ─── CRUD Operations ─────────────────────────────────────────────────────────

/**
 * Create a new API key scoped to a sandbox.
 * Returns the secret key in plaintext ONCE — only the hash is stored.
 *
 * type='user'    → bapx_<32> secret key (user-created, external access)
 * type='sandbox' → bapx_sb_<32> secret key (auto-managed, injected into sandbox)
 */
export async function createApiKey(params: CreateApiKeyParams): Promise<CreateApiKeyResult> {
  if (!isApiKeySecretConfigured()) {
    throw new Error('API_KEY_SECRET not configured');
  }

  const keyType = params.type ?? 'user';
  const { publicKey, secretKey } = keyType === 'sandbox'
    ? generateSandboxKeyPair()
    : generateApiKeyPair();
  const secretKeyHash = hashSecretKey(secretKey);

  const [row] = await db
    .insert(bapxApiKeys)
    .values({
      keyId: crypto.randomUUID(),
      sandboxId: params.sandboxId,
      accountId: params.accountId,
      publicKey,
      secretKeyHash,
      title: params.title,
      description: params.description ?? null,
      type: keyType,
      expiresAt: params.expiresAt ?? null,
    })
    .returning();

  if (!row) {
    throw new Error('Failed to create API key');
  }

  return {
    keyId: row.keyId,
    publicKey: row.publicKey,
    secretKey, // plaintext — shown once
    title: row.title,
    description: row.description,
    status: row.status,
    type: row.type as ApiKeyType,
    sandboxId: row.sandboxId,
    expiresAt: row.expiresAt,
    createdAt: row.createdAt,
  };
}

/**
 * List all API keys for a sandbox. Never returns secret data.
 */
export async function listApiKeys(sandboxId: string) {
  return db
    .select({
      keyId: bapxApiKeys.keyId,
      publicKey: bapxApiKeys.publicKey,
      title: bapxApiKeys.title,
      description: bapxApiKeys.description,
      type: bapxApiKeys.type,
      status: bapxApiKeys.status,
      sandboxId: bapxApiKeys.sandboxId,
      expiresAt: bapxApiKeys.expiresAt,
      lastUsedAt: bapxApiKeys.lastUsedAt,
      createdAt: bapxApiKeys.createdAt,
    })
    .from(bapxApiKeys)
    .where(eq(bapxApiKeys.sandboxId, sandboxId));
}

/**
 * Revoke an API key (soft-delete — sets status to 'revoked').
 */
export async function revokeApiKey(keyId: string, accountId: string): Promise<boolean> {
  const result = await db
    .update(bapxApiKeys)
    .set({ status: 'revoked' })
    .where(
      and(
        eq(bapxApiKeys.keyId, keyId),
        eq(bapxApiKeys.accountId, accountId),
        eq(bapxApiKeys.status, 'active'),
      ),
    )
    .returning({ keyId: bapxApiKeys.keyId });

  return result.length > 0;
}

/**
 * Hard-delete an API key.
 */
export async function deleteApiKey(keyId: string, accountId: string): Promise<boolean> {
  const result = await db
    .delete(bapxApiKeys)
    .where(
      and(
        eq(bapxApiKeys.keyId, keyId),
        eq(bapxApiKeys.accountId, accountId),
      ),
    )
    .returning({ keyId: bapxApiKeys.keyId });

  return result.length > 0;
}

// ─── Validation ──────────────────────────────────────────────────────────────

/**
 * Validate a Bapx API key (bapx_ or bapx_sb_ prefix).
 * Single validation path for all key types — returns account_id, sandbox_id, and key type.
 */
export async function validateSecretKey(secretKey: string): Promise<ApiKeyValidationResult> {
  if (!isApiKeySecretConfigured()) {
    return { isValid: false, error: 'API_KEY_SECRET not configured' };
  }

  if (!isBapxToken(secretKey)) {
    return { isValid: false, error: 'Invalid API key format — expected bapx_ prefix' };
  }

  try {
    const secretKeyHash = hashSecretKey(secretKey);

    const [row] = await db
      .select({
        keyId: bapxApiKeys.keyId,
        accountId: bapxApiKeys.accountId,
        sandboxId: bapxApiKeys.sandboxId,
        type: bapxApiKeys.type,
        status: bapxApiKeys.status,
        expiresAt: bapxApiKeys.expiresAt,
      })
      .from(bapxApiKeys)
      .where(
        and(
          eq(bapxApiKeys.secretKeyHash, secretKeyHash),
          eq(bapxApiKeys.status, 'active'),
        ),
      )
      .limit(1)
      .execute();

    if (!row) {
      return { isValid: false, error: 'API key not found or invalid' };
    }

    // Check expiration
    if (row.expiresAt && new Date(row.expiresAt) < new Date()) {
      return { isValid: false, error: 'API key has expired' };
    }

    // Update last_used_at (throttled)
    const now = Date.now();
    const lastUsed = lastUsedCache.get(row.keyId) || 0;
    if (now - lastUsed > THROTTLE_MS) {
      lastUsedCache.set(row.keyId, now);
      db.update(bapxApiKeys)
        .set({ lastUsedAt: new Date() })
        .where(eq(bapxApiKeys.keyId, row.keyId))
        .returning()
        .then(() => {}); // fire and forget
    }

    return {
      isValid: true,
      keyId: row.keyId,
      accountId: row.accountId,
      sandboxId: row.sandboxId,
      type: row.type as ApiKeyType,
    };
  } catch (err) {
    console.error('[validateSecretKey] Error:', err);
    return { isValid: false, error: 'Internal validation error' };
  }
}
