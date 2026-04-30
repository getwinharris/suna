DO $$ BEGIN
  CREATE TYPE "bapx"."scope_effect" AS ENUM ('grant', 'revoke');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "bapx"."sandbox_member_scopes" (
    "sandbox_id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "scope" text NOT NULL,
    "effect" "bapx"."scope_effect" NOT NULL,
    "granted_by" uuid,
    "granted_at" timestamp with time zone DEFAULT now() NOT NULL
);

DO $$ BEGIN
  ALTER TABLE "bapx"."sandbox_member_scopes"
    ADD CONSTRAINT "sandbox_member_scopes_sandbox_id_fk"
    FOREIGN KEY ("sandbox_id") REFERENCES "bapx"."sandboxes"("sandbox_id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "idx_sandbox_member_scopes_unique"
  ON "bapx"."sandbox_member_scopes" ("sandbox_id", "user_id", "scope");

CREATE INDEX IF NOT EXISTS "idx_sandbox_member_scopes_lookup"
  ON "bapx"."sandbox_member_scopes" ("sandbox_id", "user_id");
