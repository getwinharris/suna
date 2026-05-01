import { getEnv } from '@/lib/env-config'

export const BAPX_TRAILBASE_AUTH_COOKIE = 'bapx-trailbase-auth'

function decodeUserFromToken(token: string | null): any {
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
      email: decoded.email || '',
      admin: decoded.admin,
    }
  } catch {
    return null
  }
}

function trailFetch(url: string, path: string, options?: RequestInit) {
  return fetch(`${url}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
}

export function createClient(initialToken?: string | null): any {
  const runtimeEnv = getEnv()
  const url = runtimeEnv.TRAILBASE_URL || 'http://localhost:4000'
  let authToken = initialToken || null

  return {
    auth: {
      signIn: async (email: string, password: string) => {
        const res = await trailFetch(url, '/api/auth/v1/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })
        if (!res.ok) throw new Error('Login failed')
        const data = await res.json()
        authToken = data.auth_token || null
      },
      signUp: async (email: string, password: string) => {
        const res = await trailFetch(url, '/api/auth/v1/register', {
          method: 'POST',
          body: JSON.stringify({ email, password, password_repeat: password }),
        })
        if (!res.ok && res.status !== 303) {
          throw new Error(await res.text() || 'Registration failed')
        }
        await this.signIn(email, password)
      },
      signOut: async () => {
        authToken = null
        return true
      },
      sendOtp: (email: string) =>
        trailFetch(url, '/api/auth/v1/otp', { method: 'POST', body: JSON.stringify({ email }) }),
      verifyOtp: async (email: string, code: string) => {
        const res = await trailFetch(url, '/api/auth/v1/otp/verify', {
          method: 'POST',
          body: JSON.stringify({ email, code }),
        })
        if (!res.ok) throw new Error('OTP verification failed')
        const data = await res.json()
        authToken = data.auth_token || null
      },
      getToken: () => authToken,
      setToken: (token: string | null) => { authToken = token },
      getUser: async (token?: string) => {
        const t = token || authToken
        const user = decodeUserFromToken(t)
        return user ? { ...user, data: { user }, error: null } : null
      },
      getSession: async () => {
        const user = decodeUserFromToken(authToken)
        return {
          data: {
            session: authToken ? { access_token: authToken, user } : null,
          },
          error: null,
        }
      },
      refreshSession: async () => {
        return { data: { session: authToken ? { access_token: authToken, user: decodeUserFromToken(authToken) } : null }, error: null }
      },
      updateUser: async () => ({ data: { user: decodeUserFromToken(authToken) }, error: null }),
      getUrl: () => url,
    },
  }
}
