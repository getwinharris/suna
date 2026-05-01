import { beforeEach, describe, expect, mock, test } from 'bun:test';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

let mockSandboxAccountId: string | null = 'acct-owner';
let mockResolvedAccountId = 'acct-owner';
let mockTrailbaseUser: { id: string; email?: string } | null = null;
let mockAdminAccounts = new Set<string>();

mock.module('../shared/preview-ownership', () => ({
  canAccessPreviewSandbox: async ({ accountId, userId }: { accountId?: string; userId?: string }) => {
    if (!mockSandboxAccountId) return false;
    if (accountId && mockAdminAccounts.has(accountId)) return true;
    if (userId && mockAdminAccounts.has(mockResolvedAccountId)) return true;
    if (accountId) return accountId === mockSandboxAccountId;
    if (userId) return mockResolvedAccountId === mockSandboxAccountId;
    return false;
  },
  clearPreviewOwnershipCache: () => {},
}));

mock.module('../shared/resolve-account', () => ({
  resolveAccountId: async () => mockResolvedAccountId,
}));

mock.module('../shared/platform-roles', () => ({
  isPlatformAdmin: async (accountId: string) => mockAdminAccounts.has(accountId),
}));

mock.module('../repositories/api-keys', () => ({
  validateSecretKey: async (token: string) => {
    if (token === 'bapx_owner') {
      return { isValid: true, accountId: 'acct-owner' };
    }
    if (token === 'bapx_other') {
      return { isValid: true, accountId: 'acct-other' };
    }
    return { isValid: false, error: 'Invalid Bapx token' };
  },
}));

mock.module('../shared/crypto', () => ({
  isBapxToken: (token: string) => token.startsWith('bapx_'),
}));

mock.module('../shared/jwt-verify', () => ({
  verifyTrailbaseJwt: async (token: string) => {
    if (token === 'jwt-owner') {
      return { ok: true, userId: 'user-owner', email: 'owner@bapx.dev' };
    }
    if (token === 'jwt-other') {
      return { ok: true, userId: 'user-other', email: 'other@bapx.dev' };
    }
    if (token === 'jwt-fallback-owner' || token === 'jwt-fallback-other') {
      return { ok: false, reason: 'no-keys' };
    }
    return { ok: false, reason: 'invalid' };
  },
}));

mock.module('../shared/trailbase', () => ({
  getTrailbase: () => ({
    auth: {
      getUser: async () => ({ data: { user: mockTrailbaseUser }, error: mockTrailbaseUser ? null : { message: 'invalid' } }),
    },
  }),
}));

mock.module('../config', () => ({
  config: {
    isLocalDockerEnabled: () => true,
    SANDBOX_CONTAINER_NAME: 'bapx-sandbox',
  },
}));

const { combinedAuth } = await import('../middleware/auth');

function createApp() {
  const app = new Hono();
  app.use('/v1/p/:sandboxId/:port/*', combinedAuth);
  app.use('/v1/p/share', combinedAuth);
  app.get('/v1/p/:sandboxId/:port/*', (c) => c.json({ ok: true }));
  app.post('/v1/p/share', (c) => c.json({ ok: true }));
  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      return c.json({ message: err.message }, err.status);
    }
    return c.json({ message: 'Internal server error' }, 500);
  });
  return app;
}

beforeEach(() => {
  mockSandboxAccountId = 'acct-owner';
  mockResolvedAccountId = 'acct-owner';
  mockTrailbaseUser = null;
  mockAdminAccounts = new Set();
});

describe('preview auth ownership', () => {
  test('rejects request without auth token', async () => {
    const app = createApp();
    const res = await app.request('/v1/p/8c70e5be-2f95-45ae-bd8d-5d07b65c631b/8000/session/status');
    expect(res.status).toBe(401);
  });

  test('allows owner via Bearer bapx token', async () => {
    const app = createApp();
    const res = await app.request('/v1/p/8c70e5be-2f95-45ae-bd8d-5d07b65c631b/8000/session/status', {
      headers: { Authorization: 'Bearer bapx_owner' },
    });
    expect(res.status).toBe(200);
  });

  test('allows owner via X-Bapx-Token header', async () => {
    const app = createApp();
    const res = await app.request('/v1/p/8c70e5be-2f95-45ae-bd8d-5d07b65c631b/8000/session/status', {
      headers: { 'X-Bapx-Token': 'bapx_owner' },
    });
    expect(res.status).toBe(200);
  });

  test('allows owner via preview session cookie with bapx token', async () => {
    const app = createApp();
    const res = await app.request('/v1/p/8c70e5be-2f95-45ae-bd8d-5d07b65c631b/8000/session/status', {
      headers: { Cookie: '__preview_session=bapx_owner' },
    });
    expect(res.status).toBe(200);
  });

  test('rejects non-owner bapx token', async () => {
    const app = createApp();
    const res = await app.request('/v1/p/8c70e5be-2f95-45ae-bd8d-5d07b65c631b/8000/session/status', {
      headers: { Authorization: 'Bearer bapx_other' },
    });
    expect(res.status).toBe(403);
  });

  test('rejects invalid X-Bapx-Token', async () => {
    const app = createApp();
    const res = await app.request('/v1/p/8c70e5be-2f95-45ae-bd8d-5d07b65c631b/8000/session/status', {
      headers: { 'X-Bapx-Token': 'bapx_invalid' },
    });
    expect(res.status).toBe(401);
  });

  test('allows jwt owner with matching account ownership', async () => {
    const app = createApp();
    mockResolvedAccountId = 'acct-owner';
    const res = await app.request('/v1/p/8c70e5be-2f95-45ae-bd8d-5d07b65c631b/8000/session/status', {
      headers: { Authorization: 'Bearer jwt-owner' },
    });
    expect(res.status).toBe(200);
  });

  test('rejects jwt user without ownership', async () => {
    const app = createApp();
    mockResolvedAccountId = 'acct-other';
    const res = await app.request('/v1/p/8c70e5be-2f95-45ae-bd8d-5d07b65c631b/8000/session/status', {
      headers: { Authorization: 'Bearer jwt-other' },
    });
    expect(res.status).toBe(403);
  });

  test('allows admin jwt user without direct ownership', async () => {
    const app = createApp();
    mockResolvedAccountId = 'acct-admin';
    mockAdminAccounts = new Set(['acct-admin']);
    const res = await app.request('/v1/p/8c70e5be-2f95-45ae-bd8d-5d07b65c631b/8000/session/status', {
      headers: { Authorization: 'Bearer jwt-other' },
    });
    expect(res.status).toBe(200);
  });

  test('allows admin bapx token without direct ownership', async () => {
    const app = createApp();
    mockAdminAccounts = new Set(['acct-other']);
    const res = await app.request('/v1/p/8c70e5be-2f95-45ae-bd8d-5d07b65c631b/8000/session/status', {
      headers: { Authorization: 'Bearer bapx_other' },
    });
    expect(res.status).toBe(200);
  });

  test('allows jwt owner via preview session cookie', async () => {
    const app = createApp();
    mockResolvedAccountId = 'acct-owner';
    const res = await app.request('/v1/p/8c70e5be-2f95-45ae-bd8d-5d07b65c631b/8000/session/status', {
      headers: { Cookie: '__preview_session=jwt-owner' },
    });
    expect(res.status).toBe(200);
  });

  test('allows jwt owner via Trailbase fallback path', async () => {
    const app = createApp();
    mockResolvedAccountId = 'acct-owner';
    mockTrailbaseUser = { id: 'user-fallback-owner', email: 'fallback@bapx.dev' };
    const res = await app.request('/v1/p/8c70e5be-2f95-45ae-bd8d-5d07b65c631b/8000/session/status', {
      headers: { Authorization: 'Bearer jwt-fallback-owner' },
    });
    expect(res.status).toBe(200);
  });

  test('rejects jwt via Trailbase fallback without ownership', async () => {
    const app = createApp();
    mockResolvedAccountId = 'acct-other';
    mockTrailbaseUser = { id: 'user-fallback-other', email: 'other@bapx.dev' };
    const res = await app.request('/v1/p/8c70e5be-2f95-45ae-bd8d-5d07b65c631b/8000/session/status', {
      headers: { Authorization: 'Bearer jwt-fallback-other' },
    });
    expect(res.status).toBe(403);
  });

  test('rejects access when sandbox cannot be resolved', async () => {
    const app = createApp();
    mockSandboxAccountId = null;
    const res = await app.request('/v1/p/8c70e5be-2f95-45ae-bd8d-5d07b65c631b/8000/session/status', {
      headers: { Authorization: 'Bearer bapx_owner' },
    });
    expect(res.status).toBe(403);
  });

  test('does not treat /v1/p/share as a sandbox ownership route', async () => {
    const app = createApp();
    mockSandboxAccountId = null;
    const res = await app.request('/v1/p/share', {
      method: 'POST',
      headers: { Authorization: 'Bearer bapx_owner' },
    });
    expect(res.status).toBe(200);
  });

  test('allows localhost local-sandbox preview without auth', async () => {
    const app = createApp();
    const res = await app.request('http://localhost/v1/p/bapx-sandbox/8000/session/status');
    expect(res.status).toBe(200);
  });

  test('still requires auth for remote hosts hitting the local sandbox route', async () => {
    const app = createApp();
    const res = await app.request('https://app.bapx.in/v1/p/bapx-sandbox/8000/session/status');
    expect(res.status).toBe(401);
  });
});
