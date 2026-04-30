-- Ensure billing customers table exists in bapx schema.
-- Needed by billing setup/checkout flows in cloud billing mode.

create schema if not exists bapx;

create table if not exists bapx.billing_customers (
  account_id uuid not null,
  id text primary key,
  email text,
  active boolean,
  provider text
);

create index if not exists idx_bapx_billing_customers_account_id
  on bapx.billing_customers(account_id);
