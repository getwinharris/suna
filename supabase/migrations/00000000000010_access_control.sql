DO $$ BEGIN
  CREATE TYPE bapx.access_request_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS bapx.platform_settings (
  key varchar(255) PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bapx.access_allowlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_type varchar(20) NOT NULL,
  value varchar(255) NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_access_allowlist_type_value
  ON bapx.access_allowlist (entry_type, value);

CREATE TABLE IF NOT EXISTS bapx.access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(255) NOT NULL,
  company varchar(255),
  use_case text,
  status bapx.access_request_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_access_requests_email
  ON bapx.access_requests (email);
CREATE INDEX IF NOT EXISTS idx_access_requests_status
  ON bapx.access_requests (status);

-- Seed: signups enabled by default
INSERT INTO bapx.platform_settings (key, value)
VALUES ('signups_enabled', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Grant access to service role
GRANT ALL ON bapx.platform_settings TO service_role;
GRANT ALL ON bapx.access_allowlist TO service_role;
GRANT ALL ON bapx.access_requests TO service_role;
