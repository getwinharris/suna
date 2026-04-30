DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'bapx'
      AND t.typname = 'sandbox_provider'
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM bapx.sandboxes
      WHERE provider::text = 'hetzner'
    ) THEN
      RAISE EXCEPTION 'Cannot remove hetzner sandbox provider enum while Hetzner sandboxes still exist';
    END IF;

    ALTER TYPE bapx.sandbox_provider RENAME TO sandbox_provider_old;
    CREATE TYPE bapx.sandbox_provider AS ENUM ('daytona', 'local_docker', 'justavps');

    ALTER TABLE bapx.sandboxes
      ALTER COLUMN provider DROP DEFAULT;

    ALTER TABLE bapx.sandboxes
      ALTER COLUMN provider TYPE bapx.sandbox_provider
      USING provider::text::bapx.sandbox_provider;

    ALTER TABLE bapx.sandboxes
      ALTER COLUMN provider SET DEFAULT 'daytona';

    ALTER TABLE bapx.server_entries
      ALTER COLUMN provider TYPE bapx.sandbox_provider
      USING provider::text::bapx.sandbox_provider;

    ALTER TABLE bapx.pool_resources
      ALTER COLUMN provider TYPE bapx.sandbox_provider
      USING provider::text::bapx.sandbox_provider;

    ALTER TABLE bapx.pool_sandboxes
      ALTER COLUMN provider TYPE bapx.sandbox_provider
      USING provider::text::bapx.sandbox_provider;

    DROP TYPE bapx.sandbox_provider_old;
  END IF;
END $$;
