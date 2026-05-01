/**
 * Hono middleware that verifies the signed `X-Bapx-User-Context` header
 * on incoming requests and attaches the parsed context to the Hono context
 * under the `bapxUser` key. Downstream handlers read it to make per-user
 * authorization decisions (project ACL, session scoping).
 *
 * No header → `bapxUser` is absent (legacy / anonymous path). Any existing
 * route stays functional — user-aware logic layers on top without breaking
 * service-to-service traffic or pre-phase-1 clients.
 *
 * Invalid header → we log and treat as absent rather than 401, so the
 * authenticated `Authorization: Bearer <serviceKey>` layer (the existing
 * gate) still owns the hard access decision. The context header is purely
 * additive identity information.
 */

import type { Context, Next } from 'hono'
import {
  BAPX_USER_CONTEXT_HEADER,
  verifyBapxUserContext,
  type BapxUserContext,
} from './bapx-user-context'
import { rememberUserScopes } from './user-scope-cache'

declare module 'hono' {
  interface ContextVariableMap {
    bapxUser?: BapxUserContext
  }
}

export function bapxUserContextMiddleware() {
  return async (c: Context, next: Next) => {
    const raw = c.req.header(BAPX_USER_CONTEXT_HEADER)
    console.log(
      `[bapx-user] ${c.req.method} ${c.req.path} header=${raw ? `present(${raw.slice(0, 16)}…)` : 'absent'}`,
    )
    if (!raw) {
      await next()
      return
    }

    const secret = process.env.BAPX_TOKEN
    if (!secret) {
      console.warn('[bapx-user] BAPX_TOKEN unset; skipping verification')
      await next()
      return
    }

    const result = verifyBapxUserContext(raw, secret)
    if (!result.ok) {
      console.warn(
        `[bapx-user] Ignoring bad ${BAPX_USER_CONTEXT_HEADER} (${result.reason}); continuing without user context`,
      )
      await next()
      return
    }

    console.log(
      `[bapx-user] verified user=${result.context.userId} sandbox=${result.context.sandboxId} role=${result.context.sandboxRole}`,
    )
    c.set('bapxUser', result.context)
    rememberUserScopes(result.context.userId, result.context.scopes ?? [])

    await next()
  }
}
