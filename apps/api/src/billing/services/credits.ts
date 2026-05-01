import { getTrailbase } from '../../shared/trailbase';
import {
  getCreditAccount,
  getCreditBalance,
  updateCreditAccount,
  updateBalance,
} from '../repositories/credit-accounts';
import { insertLedgerEntry } from '../repositories/transactions';
import { InsufficientCreditsError } from '../../errors';
import { TOKEN_PRICE_MULTIPLIER, MINIMUM_CREDIT_FOR_RUN } from './tiers';
import { db } from '../../shared/db';
import { sql } from 'drizzle-orm';

export async function getBalance(accountId: string) {
  const row = await getCreditBalance(accountId);
  if (!row) return { balance: 0, expiring: 0, nonExpiring: 0, daily: 0 };

  return {
    balance: Number(row.balance),
    expiring: Number(row.expiringCredits),
    nonExpiring: Number(row.nonExpiringCredits),
    daily: Number(row.dailyCreditsBalance),
  };
}

export async function getCreditSummary(accountId: string) {
  const account = await getCreditAccount(accountId);
  if (!account) {
    return { total: 0, daily: 0, monthly: 0, extra: 0, canRun: false };
  }

  // Pure read. balance is kept in sync by the atomic RPCs (deduct/grant/reset).
  const daily = Number(account.dailyCreditsBalance) || 0;
  const monthly = Number(account.expiringCredits) || 0;
  const extra = Number(account.nonExpiringCredits) || 0;
  const total = Number(account.balance) || 0;

  return {
    total,
    daily,
    monthly,
    extra,
    canRun: total >= MINIMUM_CREDIT_FOR_RUN,
  };
}

export async function deductCredits(
  accountId: string,
  amount: number,
  description: string,
) {
  const account = await getCreditAccount(accountId);
  if (!account) {
    throw new InsufficientCreditsError(0, amount);
  }

  const currentTotal = Number(account.balance) || 0;
  const currentDaily = Number(account.dailyCreditsBalance) || 0;
  const currentExpiring = Number(account.expiringCredits) || 0;
  const currentNonExpiring = Number(account.nonExpiringCredits) || 0;

  if (currentTotal < amount) {
    throw new InsufficientCreditsError(currentTotal, amount);
  }

  // Atomically calculate new balances. 
  // Priority: Daily -> Expiring -> Non-Expiring
  let remainingToDeduct = amount;
  let newDaily = currentDaily;
  let newExpiring = currentExpiring;
  let newNonExpiring = currentNonExpiring;

  if (newDaily >= remainingToDeduct) {
    newDaily -= remainingToDeduct;
    remainingToDeduct = 0;
  } else {
    remainingToDeduct -= newDaily;
    newDaily = 0;
  }

  if (remainingToDeduct > 0) {
    if (newExpiring >= remainingToDeduct) {
      newExpiring -= remainingToDeduct;
      remainingToDeduct = 0;
    } else {
      remainingToDeduct -= newExpiring;
      newExpiring = 0;
    }
  }

  if (remainingToDeduct > 0) {
    newNonExpiring -= remainingToDeduct;
  }

  const newTotal = newDaily + newExpiring + newNonExpiring;

  // Update account
  await updateBalance(accountId, {
    balance: String(newTotal),
    dailyCreditsBalance: String(newDaily),
    expiringCredits: String(newExpiring),
    nonExpiringCredits: String(newNonExpiring),
  });

  // Log transaction
  const [entry] = await insertLedgerEntry({
    accountId,
    amount: String(-amount),
    balanceAfter: String(newTotal),
    type: 'usage',
    description,
    isExpiring: false,
  });

  // Fire-and-forget: check if auto-topup should trigger
  const { checkAndTriggerAutoTopup } = await import('./auto-topup');
  void checkAndTriggerAutoTopup(accountId);

  return {
    success: true,
    cost: amount,
    newBalance: newTotal,
    transactionId: (entry as any)?.id,
  };
}

interface ModelPricing {
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  cachedInputPricePerMillion?: number;
}

const MODEL_PRICING: Record<string, ModelPricing> = {
  'claude-3-5-sonnet': { inputPricePerMillion: 3, outputPricePerMillion: 15 },
  'claude-3-5-haiku': { inputPricePerMillion: 0.25, outputPricePerMillion: 1.25 },
  'claude-sonnet-4-5': { inputPricePerMillion: 3, outputPricePerMillion: 15 },
  'claude-haiku-4-5': { inputPricePerMillion: 0.25, outputPricePerMillion: 1.25 },
  'gpt-4o': { inputPricePerMillion: 2.5, outputPricePerMillion: 10 },
  'gpt-4o-mini': { inputPricePerMillion: 0.15, outputPricePerMillion: 0.6 },
  'o1': { inputPricePerMillion: 15, outputPricePerMillion: 60 },
  'o1-mini': { inputPricePerMillion: 1.1, outputPricePerMillion: 4.4 },
  'o3-mini': { inputPricePerMillion: 1.1, outputPricePerMillion: 4.4 },
  'grok-2': { inputPricePerMillion: 2, outputPricePerMillion: 10 },
  'gemini-2.0-flash': { inputPricePerMillion: 0.1, outputPricePerMillion: 0.4 },
  'gemini-2.0-pro': { inputPricePerMillion: 1.25, outputPricePerMillion: 10 },
  'deepseek-r1': { inputPricePerMillion: 3, outputPricePerMillion: 8 },
  'deepseek-v3': { inputPricePerMillion: 0.5, outputPricePerMillion: 1.5 },
};

function getModelPricing(model: string): ModelPricing {
  if (MODEL_PRICING[model]) return MODEL_PRICING[model];

  for (const [key, pricing] of Object.entries(MODEL_PRICING)) {
    if (model.startsWith(key) || model.includes(key)) return pricing;
  }

  return { inputPricePerMillion: 2, outputPricePerMillion: 10 };
}

export function calculateTokenCost(
  promptTokens: number,
  completionTokens: number,
  model: string,
): number {
  const pricing = getModelPricing(model);
  const inputCost = (promptTokens / 1_000_000) * pricing.inputPricePerMillion;
  const outputCost = (completionTokens / 1_000_000) * pricing.outputPricePerMillion;
  return (inputCost + outputCost) * TOKEN_PRICE_MULTIPLIER;
}

export async function grantCredits(
  accountId: string,
  amount: number,
  type: string,
  description: string,
  isExpiring: boolean = true,
  stripeEventId?: string,
) {
  const idempotencyKey = stripeEventId ? `grant:${accountId}:${stripeEventId}` : null;

  const account = await getCreditAccount(accountId);
  const currentTotal = account ? Number(account.balance) : 0;
  const currentExpiring = account ? Number(account.expiringCredits) : 0;
  const currentNonExpiring = account ? Number(account.nonExpiringCredits) : 0;

  const newTotal = currentTotal + amount;
  let newExpiring = currentExpiring;
  let newNonExpiring = currentNonExpiring;

  if (isExpiring) {
    newExpiring += amount;
  } else {
    newNonExpiring += amount;
  }

  try {
    // Log transaction with idempotency check
    const [entry] = await insertLedgerEntry({
      accountId,
      amount: String(amount),
      balanceAfter: String(newTotal),
      type,
      description,
      isExpiring,
      stripeEventId: stripeEventId ?? null,
      idempotencyKey,
    });

    // Update account balance
    await updateBalance(accountId, {
      balance: String(newTotal),
      expiringCredits: String(newExpiring),
      nonExpiringCredits: String(newNonExpiring),
    });

    return {
      success: true,
      newBalance: newTotal,
      transactionId: (entry as any)?.id
    };
  } catch (err: any) {
    const message = err instanceof Error ? err.message : String(err);
    const isDuplicate =
      message.includes('duplicate key') ||
      message.includes('UNIQUE constraint failed');

    if (isDuplicate) {
      return { success: true, duplicate_prevented: true };
    }

    throw err;
  }
}

export async function resetExpiringCredits(
  accountId: string,
  newCredits: number,
  description: string,
  stripeEventId?: string,
) {
  const trailbase = getTrailbase();

  const { error } = await trailbase.rpc('atomic_reset_expiring_credits', {
    p_account_id: accountId,
    p_description: description,
    p_new_credits: newCredits,
    p_stripe_event_id: stripeEventId ?? null,
  });

  if (error) {
    console.error('[Credits] Reset expiring credits error, using drizzle fallback:', error);

    const account = await getCreditAccount(accountId);
    if (account) {
      const nonExpiring = Number(account.nonExpiringCredits) || 0;
      const daily = Number(account.dailyCreditsBalance) || 0;
      const newBalance = newCredits + nonExpiring + daily;

      await updateCreditAccount(accountId, {
        expiringCredits: String(newCredits),
        balance: String(newBalance),
      } as any);
    }

    try {
      await insertLedgerEntry({
        accountId,
        amount: String(newCredits),
        balanceAfter: String(newCredits + (Number(account?.nonExpiringCredits) || 0)),
        type: 'credit_reset',
        description,
        isExpiring: true,
        stripeEventId: stripeEventId ?? null,
      });
    } catch (ledgerErr) {
      const msg = ledgerErr instanceof Error ? ledgerErr.message : String(ledgerErr);
      if (!msg.includes('duplicate key')) {
        console.error('[Credits] Reset ledger entry failed:', ledgerErr);
      }
    }
  }
}


