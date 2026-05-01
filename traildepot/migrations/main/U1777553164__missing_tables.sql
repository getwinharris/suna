-- Migration V2: All remaining Supabase tables ported to TrailBase SQLite
-- Converts PostgreSQL types (uuid, jsonb, timestamptz, enums) to SQLite STRICT equivalents.

-- ══════════════════════════════════════════════════════════════════════════════
-- Platform Settings
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE platform_settings (
    id BLOB PRIMARY KEY CHECK (is_uuid_v4(id)),
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL DEFAULT '{}',
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
) STRICT;

-- ══════════════════════════════════════════════════════════════════════════════
-- Access Control
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE access_allowlist (
    id BLOB PRIMARY KEY CHECK (is_uuid_v4(id)),
    entry_type TEXT NOT NULL,
    value TEXT NOT NULL,
    note TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
) STRICT;

CREATE UNIQUE INDEX idx_access_allowlist_type_value ON access_allowlist (entry_type, value);

CREATE TABLE access_requests (
    id BLOB PRIMARY KEY CHECK (is_uuid_v4(id)),
    email TEXT NOT NULL,
    company TEXT,
    use_case TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
) STRICT;

CREATE INDEX idx_access_requests_email ON access_requests (email);
CREATE INDEX idx_access_requests_status ON access_requests (status);

-- ══════════════════════════════════════════════════════════════════════════════
-- Account Deletion Requests
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE account_deletion_requests (
    id BLOB PRIMARY KEY CHECK (is_uuid_v4(id)),
    account_id BLOB NOT NULL CHECK (is_uuid_v4(account_id)),
    user_id BLOB NOT NULL CHECK (is_uuid_v4(user_id)),
    status TEXT NOT NULL DEFAULT 'pending',
    reason TEXT,
    requested_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    scheduled_for TEXT NOT NULL,
    completed_at TEXT,
    cancelled_at TEXT
) STRICT;

-- ══════════════════════════════════════════════════════════════════════════════
-- Credit Purchases
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE credit_purchases (
    id BLOB PRIMARY KEY CHECK (is_uuid_v4(id)),
    account_id BLOB NOT NULL CHECK (is_uuid_v4(account_id)),
    amount_dollars REAL NOT NULL,
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    description TEXT,
    metadata TEXT NOT NULL DEFAULT '{}',
    created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    completed_at TEXT,
    provider TEXT DEFAULT 'stripe',
    revenuecat_transaction_id TEXT,
    revenuecat_product_id TEXT
) STRICT;

-- ══════════════════════════════════════════════════════════════════════════════
-- OAuth Tables
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE oauth_clients (
    client_id BLOB PRIMARY KEY CHECK (is_uuid_v4(client_id)),
    client_secret_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    redirect_uris TEXT NOT NULL DEFAULT '[]',
    scopes TEXT NOT NULL DEFAULT '[]',
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
) STRICT;

CREATE TABLE oauth_access_tokens (
    id BLOB PRIMARY KEY CHECK (is_uuid_v4(id)),
    token_hash TEXT NOT NULL,
    client_id BLOB NOT NULL CHECK (is_uuid_v4(client_id)),
    user_id BLOB NOT NULL CHECK (is_uuid_v4(user_id)),
    account_id BLOB NOT NULL CHECK (is_uuid_v4(account_id)),
    scopes TEXT NOT NULL DEFAULT '[]',
    expires_at TEXT NOT NULL,
    revoked_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (client_id) REFERENCES oauth_clients(client_id) ON DELETE CASCADE
) STRICT;

CREATE UNIQUE INDEX idx_oauth_access_token_hash ON oauth_access_tokens (token_hash);

CREATE TABLE oauth_authorization_codes (
    id BLOB PRIMARY KEY CHECK (is_uuid_v4(id)),
    code TEXT NOT NULL,
    client_id BLOB NOT NULL CHECK (is_uuid_v4(client_id)),
    user_id BLOB NOT NULL CHECK (is_uuid_v4(user_id)),
    account_id BLOB NOT NULL CHECK (is_uuid_v4(account_id)),
    redirect_uri TEXT NOT NULL,
    scopes TEXT NOT NULL DEFAULT '[]',
    code_challenge TEXT NOT NULL,
    code_challenge_method TEXT NOT NULL DEFAULT 'S256',
    expires_at TEXT NOT NULL,
    used_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (client_id) REFERENCES oauth_clients(client_id) ON DELETE CASCADE
) STRICT;

CREATE UNIQUE INDEX idx_oauth_codes_code ON oauth_authorization_codes (code);

CREATE TABLE oauth_refresh_tokens (
    id BLOB PRIMARY KEY CHECK (is_uuid_v4(id)),
    token_hash TEXT NOT NULL,
    access_token_id BLOB NOT NULL CHECK (is_uuid_v4(access_token_id)),
    client_id BLOB NOT NULL CHECK (is_uuid_v4(client_id)),
    user_id BLOB NOT NULL CHECK (is_uuid_v4(user_id)),
    account_id BLOB NOT NULL CHECK (is_uuid_v4(account_id)),
    expires_at TEXT NOT NULL,
    revoked_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (access_token_id) REFERENCES oauth_access_tokens(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES oauth_clients(client_id) ON DELETE CASCADE
) STRICT;

CREATE UNIQUE INDEX idx_oauth_refresh_token_hash ON oauth_refresh_tokens (token_hash);

-- ══════════════════════════════════════════════════════════════════════════════
-- Pool Resources (sandbox pool management)
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE pool_resources (
    id BLOB PRIMARY KEY CHECK (is_uuid_v4(id)),
    provider TEXT NOT NULL,
    server_type TEXT NOT NULL,
    location TEXT NOT NULL,
    desired_count INTEGER NOT NULL DEFAULT 2,
    enabled INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
) STRICT;

CREATE UNIQUE INDEX idx_pool_resources_unique ON pool_resources (provider, server_type, location);

CREATE TABLE pool_sandboxes (
    id BLOB PRIMARY KEY CHECK (is_uuid_v4(id)),
    resource_id BLOB CHECK (is_uuid_v4(resource_id)),
    provider TEXT NOT NULL,
    external_id TEXT NOT NULL,
    base_url TEXT NOT NULL DEFAULT '',
    server_type TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'provisioning',
    metadata TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    ready_at TEXT,
    FOREIGN KEY (resource_id) REFERENCES pool_resources(id) ON DELETE SET NULL
) STRICT;

CREATE INDEX idx_pool_sandboxes_claim ON pool_sandboxes (status, created_at);

-- ══════════════════════════════════════════════════════════════════════════════
-- Sandbox Integrations
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE sandbox_integrations (
    id BLOB PRIMARY KEY CHECK (is_uuid_v4(id)),
    sandbox_id BLOB NOT NULL CHECK (is_uuid_v4(sandbox_id)),
    integration_id BLOB NOT NULL CHECK (is_uuid_v4(integration_id)),
    granted_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (sandbox_id) REFERENCES sandboxes(sandbox_id) ON DELETE CASCADE,
    FOREIGN KEY (integration_id) REFERENCES integrations(integration_id) ON DELETE CASCADE
) STRICT;

CREATE UNIQUE INDEX idx_sandbox_integration_unique ON sandbox_integrations (sandbox_id, integration_id);

-- ══════════════════════════════════════════════════════════════════════════════
-- Sandbox Invites
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE sandbox_invites (
    invite_id BLOB PRIMARY KEY CHECK (is_uuid_v4(invite_id)),
    sandbox_id BLOB NOT NULL CHECK (is_uuid_v4(sandbox_id)),
    account_id BLOB NOT NULL CHECK (is_uuid_v4(account_id)),
    email TEXT NOT NULL,
    invited_by BLOB CHECK (is_uuid_v4(invited_by)),
    accepted_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (sandbox_id) REFERENCES sandboxes(sandbox_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX idx_sandbox_invites_email ON sandbox_invites (email);
CREATE INDEX idx_sandbox_invites_sandbox ON sandbox_invites (sandbox_id);

-- ══════════════════════════════════════════════════════════════════════════════
-- Server Entries
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE server_entries (
    entry_id BLOB PRIMARY KEY CHECK (is_uuid_v4(entry_id)),
    id TEXT NOT NULL,
    account_id BLOB CHECK (is_uuid_v4(account_id)),
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    is_default INTEGER NOT NULL DEFAULT 0,
    provider TEXT,
    sandbox_id TEXT,
    mapped_ports TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
) STRICT;

-- ══════════════════════════════════════════════════════════════════════════════
-- Tunnel Tables
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE tunnel_connections (
    tunnel_id BLOB PRIMARY KEY CHECK (is_uuid_v4(tunnel_id)),
    account_id BLOB NOT NULL CHECK (is_uuid_v4(account_id)),
    sandbox_id BLOB CHECK (is_uuid_v4(sandbox_id)),
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'connecting')),
    capabilities TEXT NOT NULL DEFAULT '[]',
    machine_info TEXT NOT NULL DEFAULT '{}',
    setup_token_hash TEXT,
    last_heartbeat_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (sandbox_id) REFERENCES sandboxes(sandbox_id) ON DELETE SET NULL
) STRICT;

CREATE INDEX idx_tunnel_connections_account ON tunnel_connections (account_id);
CREATE INDEX idx_tunnel_connections_sandbox ON tunnel_connections (sandbox_id);
CREATE INDEX idx_tunnel_connections_status ON tunnel_connections (status);

CREATE TABLE tunnel_permissions (
    permission_id BLOB PRIMARY KEY CHECK (is_uuid_v4(permission_id)),
    tunnel_id BLOB NOT NULL CHECK (is_uuid_v4(tunnel_id)),
    account_id BLOB NOT NULL CHECK (is_uuid_v4(account_id)),
    capability TEXT NOT NULL,
    scope TEXT NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    expires_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (tunnel_id) REFERENCES tunnel_connections(tunnel_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX idx_tunnel_permissions_tunnel ON tunnel_permissions (tunnel_id);
CREATE INDEX idx_tunnel_permissions_account ON tunnel_permissions (account_id);
CREATE INDEX idx_tunnel_permissions_capability ON tunnel_permissions (capability);
CREATE INDEX idx_tunnel_permissions_status ON tunnel_permissions (status);

CREATE TABLE tunnel_permission_requests (
    request_id BLOB PRIMARY KEY CHECK (is_uuid_v4(request_id)),
    tunnel_id BLOB NOT NULL CHECK (is_uuid_v4(tunnel_id)),
    account_id BLOB NOT NULL CHECK (is_uuid_v4(account_id)),
    capability TEXT NOT NULL,
    requested_scope TEXT NOT NULL DEFAULT '{}',
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'expired')),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (tunnel_id) REFERENCES tunnel_connections(tunnel_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX idx_tunnel_perm_requests_tunnel ON tunnel_permission_requests (tunnel_id);
CREATE INDEX idx_tunnel_perm_requests_account ON tunnel_permission_requests (account_id);
CREATE INDEX idx_tunnel_perm_requests_status ON tunnel_permission_requests (status);

CREATE TABLE tunnel_audit_logs (
    log_id BLOB PRIMARY KEY CHECK (is_uuid_v4(log_id)),
    tunnel_id BLOB NOT NULL CHECK (is_uuid_v4(tunnel_id)),
    account_id BLOB NOT NULL CHECK (is_uuid_v4(account_id)),
    capability TEXT NOT NULL,
    operation TEXT NOT NULL,
    request_summary TEXT NOT NULL DEFAULT '{}',
    success INTEGER NOT NULL,
    duration_ms INTEGER,
    bytes_transferred INTEGER,
    error_message TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (tunnel_id) REFERENCES tunnel_connections(tunnel_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX idx_tunnel_audit_tunnel ON tunnel_audit_logs (tunnel_id);
CREATE INDEX idx_tunnel_audit_account ON tunnel_audit_logs (account_id);
CREATE INDEX idx_tunnel_audit_capability ON tunnel_audit_logs (capability);
CREATE INDEX idx_tunnel_audit_created ON tunnel_audit_logs (created_at);

-- ══════════════════════════════════════════════════════════════════════════════
-- Seed data: signups enabled by default
-- ══════════════════════════════════════════════════════════════════════════════
INSERT OR IGNORE INTO platform_settings (key, value) VALUES ('signups_enabled', 'true');
