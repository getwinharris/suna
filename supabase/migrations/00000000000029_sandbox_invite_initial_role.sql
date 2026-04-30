ALTER TABLE "bapx"."sandbox_invites"
  ADD COLUMN IF NOT EXISTS "initial_role" "bapx"."account_role";

UPDATE "bapx"."sandbox_invites"
SET "initial_role" = 'member'
WHERE "initial_role" IS NULL;

ALTER TABLE "bapx"."sandbox_invites"
  ALTER COLUMN "initial_role" SET DEFAULT 'member';

ALTER TABLE "bapx"."sandbox_invites"
  ALTER COLUMN "initial_role" SET NOT NULL;
