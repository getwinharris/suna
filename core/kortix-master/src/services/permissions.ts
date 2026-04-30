import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'

import type { BapxUserContext } from './bapx-user-context'

export type BapxScope = string

const WILDCARD: BapxScope = '*'
const MANAGER_ROLES = new Set(['owner', 'platform_admin'])

function getUser(c: Context): BapxUserContext | undefined {
  return c.get('bapxUser') as BapxUserContext | undefined
}

export function hasScope(
  user: BapxUserContext | undefined,
  scope: BapxScope,
): boolean {
  if (!user) return true
  if (MANAGER_ROLES.has(user.sandboxRole)) return true
  if (user.scopes?.includes(WILDCARD)) return true
  return user.scopes?.includes(scope) ?? false
}

export function hasScopeIn(
  user: BapxUserContext | undefined,
  ...scopes: BapxScope[]
): boolean {
  return scopes.some((s) => hasScope(user, s))
}

export function requireScope(scope: BapxScope) {
  return async (c: Context, next: () => Promise<void>) => {
    const user = getUser(c)
    if (!hasScope(user, scope)) {
      throw new HTTPException(403, { message: `Missing permission: ${scope}` })
    }
    await next()
  }
}

export function assertScope(c: Context, scope: BapxScope): void {
  const user = getUser(c)
  if (!hasScope(user, scope)) {
    throw new HTTPException(403, { message: `Missing permission: ${scope}` })
  }
}

export function isManager(user: BapxUserContext | undefined): boolean {
  if (!user) return true
  return MANAGER_ROLES.has(user.sandboxRole)
}
