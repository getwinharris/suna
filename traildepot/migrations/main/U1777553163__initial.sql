-- Initial migration for Kortix on Trailbase

-- Accounts
CREATE TABLE accounts (
    account_id BLOB PRIMARY KEY CHECK (is_uuid_v4(account_id)),
    name TEXT NOT NULL,
    personal_account INTEGER NOT NULL DEFAULT 1,
    setup_complete_at TEXT,
    setup_wizard_step INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
) STRICT;

-- Account Members
CREATE TABLE account_members (
    id BLOB PRIMARY KEY CHECK (is_uuid_v4(id)),
    user_id BLOB NOT NULL CHECK (is_uuid_v4(user_id)),
    account_id BLOB NOT NULL CHECK (is_uuid_v4(account_id)),
    account_role TEXT NOT NULL DEFAULT 'owner',
    joined_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    UNIQUE (user_id, account_id),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE
) STRICT;

-- Sandboxes
CREATE TABLE sandboxes (
    sandbox_id BLOB PRIMARY KEY CHECK (is_uuid_v4(sandbox_id)),
    account_id BLOB NOT NULL CHECK (is_uuid_v4(account_id)),
    name TEXT NOT NULL,
    provider TEXT NOT NULL DEFAULT 'local_docker',
    external_id TEXT,
    status TEXT NOT NULL DEFAULT 'provisioning',
    base_url TEXT NOT NULL,
    config TEXT NOT NULL DEFAULT '{}',
    metadata TEXT NOT NULL DEFAULT '{}',
    last_used_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    is_included INTEGER NOT NULL DEFAULT 0,
    stripe_subscription_item_id TEXT
) STRICT;

-- Sandbox Members
CREATE TABLE sandbox_members (
    id BLOB PRIMARY KEY CHECK (is_uuid_v4(id)),
    sandbox_id BLOB NOT NULL CHECK (is_uuid_v4(sandbox_id)),
    user_id BLOB NOT NULL CHECK (is_uuid_v4(user_id)),
    added_by BLOB CHECK (is_uuid_v4(added_by)),
    added_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    monthly_spend_cap_cents INTEGER,
    current_period_cents INTEGER NOT NULL DEFAULT 0,
    current_period_start INTEGER,
    UNIQUE (sandbox_id, user_id),
    FOREIGN KEY (sandbox_id) REFERENCES sandboxes(sandbox_id) ON DELETE CASCADE
) STRICT;

-- API Keys
CREATE TABLE api_keys (
    key_id BLOB PRIMARY KEY CHECK (is_uuid_v4(key_id)),
    sandbox_id BLOB NOT NULL CHECK (is_uuid_v4(sandbox_id)),
    account_id BLOB NOT NULL CHECK (is_uuid_v4(account_id)),
    public_key TEXT NOT NULL,
    secret_key_hash TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'user',
    status TEXT NOT NULL DEFAULT 'active',
    expires_at TEXT,
    last_used_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (sandbox_id) REFERENCES sandboxes(sandbox_id) ON DELETE CASCADE
) STRICT;

-- Integrations
CREATE TABLE integrations (
    integration_id BLOB PRIMARY KEY CHECK (is_uuid_v4(integration_id)),
    account_id BLOB NOT NULL CHECK (is_uuid_v4(account_id)),
    app TEXT NOT NULL,
    app_name TEXT,
    provider_name TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    label TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    scopes TEXT NOT NULL DEFAULT '[]',
    metadata TEXT NOT NULL DEFAULT '{}',
    connected_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    last_used_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
) STRICT;

-- Deployments
CREATE TABLE deployments (
    deployment_id BLOB PRIMARY KEY CHECK (is_uuid_v4(deployment_id)),
    account_id BLOB NOT NULL CHECK (is_uuid_v4(account_id)),
    sandbox_id BLOB CHECK (is_uuid_v4(sandbox_id)),
    freestyle_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    source_type TEXT NOT NULL,
    source_ref TEXT,
    framework TEXT,
    domains TEXT NOT NULL DEFAULT '[]',
    live_url TEXT,
    env_vars TEXT NOT NULL DEFAULT '{}',
    build_config TEXT,
    entrypoint TEXT,
    error TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    metadata TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (sandbox_id) REFERENCES sandboxes(sandbox_id) ON DELETE SET NULL
) STRICT;
