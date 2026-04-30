ALTER TABLE "bapx"."sandbox_invites"
  ADD COLUMN IF NOT EXISTS "expires_at" timestamp with time zone;

UPDATE "bapx"."sandbox_invites"
SET "expires_at" = "created_at" + interval '14 days'
WHERE "expires_at" IS NULL;

ALTER TABLE "bapx"."sandbox_invites"
  ALTER COLUMN "expires_at" SET DEFAULT now() + interval '14 days';

ALTER TABLE "bapx"."sandbox_invites"
  ALTER COLUMN "expires_at" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "idx_sandbox_invites_expires_at"
  ON "bapx"."sandbox_invites" ("expires_at");
