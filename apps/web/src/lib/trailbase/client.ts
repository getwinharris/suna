import { initClient, type Client, type Tokens, type User } from 'trailbase'
import { getEnv } from '@/lib/env-config'

export const BAPX_TRAILBASE_AUTH_COOKIE = 'bapx-trailbase-auth'

export type TrailbaseCompatClient = Client & {
  auth: any
  storage?: any
  [key: string]: any
}

function tokensFromAuthToken(token: string | null): Tokens | undefined {
  if (!token) return undefined
  return {
    auth_token: token,
    refresh_token: null,
    csrf_token: null,
  }
}

function decodeUserFromToken(token: string | null): User | null {
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    const padded = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padding = (4 - (padded.length % 4)) % 4
    const decoded = JSON.parse(atob(padded + '='.repeat(padding)))
    if (!decoded.sub) return null

    return {
      id: decoded.sub,
      email: decoded.email || decoded.user_metadata?.email || '',
      admin: decoded.admin,
      mfa: decoded.mfa,
    }
  } catch {
    return null
  }
}

async function registerUser(client: Client, email: string, password: string) {
  const response = await client.fetch('/api/auth/v1/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      password_repeat: password,
    }),
    throwOnError: false,
  })

  if (!response.ok && response.status !== 303) {
    const message = await response.text().catch(() => 'Registration failed')
    throw new Error(message || 'Registration failed')
  }
}

export function createClient(initialToken?: string | null): TrailbaseCompatClient {
  const runtimeEnv = getEnv()
  const url = runtimeEnv.TRAILBASE_URL || 'http://localhost:4000'
  let authToken = initialToken || null
  let rawClient = initClient(url, { tokens: tokensFromAuthToken(authToken) })

  const getCurrentSession = () => {
    const token = rawClient.tokens()?.auth_token || authToken
    const user = rawClient.user() || decodeUserFromToken(token)
    return token ? { access_token: token, user } : null
  }

  const getCurrentUser = () => rawClient.user() || decodeUserFromToken(rawClient.tokens()?.auth_token || authToken)

  const compat = new Proxy({} as TrailbaseCompatClient, {
    get(_target, prop) {
      if (prop === 'auth') {
        return {
          signIn: async (email: string, password: string) => {
            await rawClient.login(email, password)
            authToken = rawClient.tokens()?.auth_token || null
          },
          signUp: async (email: string, password: string) => {
            await registerUser(rawClient, email, password)
            await rawClient.login(email, password)
            authToken = rawClient.tokens()?.auth_token || null
          },
          signOut: async () => {
            const didLogout = await rawClient.logout()
            authToken = null
            return didLogout
          },
          sendOtp: (email: string) => rawClient.requestOtp(email),
          verifyOtp: async (email: string, code: string) => {
            await rawClient.loginOtp(email, code)
            authToken = rawClient.tokens()?.auth_token || null
          },
          getToken: () => rawClient.tokens()?.auth_token || authToken,
          setToken: (token: string | null) => {
            authToken = token
            rawClient = initClient(url, { tokens: tokensFromAuthToken(token) })
          },
          getUser: async (token?: string) => {
            if (token && token !== authToken) {
              authToken = token
              rawClient = initClient(url, { tokens: tokensFromAuthToken(token) })
            }

            await rawClient.refreshAuthToken().catch(() => undefined)
            const user = getCurrentUser()
            return user ? { ...user, data: { user }, error: null } : null
          },
          getSession: async () => {
            await rawClient.refreshAuthToken().catch(() => undefined)
            return { data: { session: getCurrentSession() }, error: null }
          },
          refreshSession: async () => {
            await rawClient.refreshAuthToken({ force: true }).catch(() => undefined)
            return { data: { session: getCurrentSession() }, error: null }
          },
          updateUser: async () => {
            return { data: { user: getCurrentUser() }, error: null }
          },
          getUrl: () => url,
        }
      }

      const value = (rawClient as any)[prop]
      return typeof value === 'function' ? value.bind(rawClient) : value
    },
  })

  return compat
}
