import { createBrowserClient } from '@trailbase/ssr'
import { BAPX_TRAILBASE_AUTH_COOKIE } from './constants'
import { getEnv } from '@/lib/env-config'

export function createClient() {
  const runtimeEnv = getEnv()
  const url = runtimeEnv.TRAILBASE_URL
  const key = runtimeEnv.TRAILBASE_ANON_KEY

  if (!url || !key) {
    if (typeof window !== 'undefined') {
      throw new Error('Missing Trailbase browser environment variables');
    }

    return createBrowserClient('https://placeholder.invalid', 'placeholder-anon-key', {
      cookieOptions: {
        name: BAPX_TRAILBASE_AUTH_COOKIE,
        path: '/',
        sameSite: 'lax',
      },
    })
  }

  return createBrowserClient(url, key, {
    cookieOptions: {
      name: BAPX_TRAILBASE_AUTH_COOKIE,
      path: '/',
      sameSite: 'lax',
    },
  })
}
