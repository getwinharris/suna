import { initClient } from 'trailbase'
import { getEnv } from '@/lib/env-config'

export const BAPX_TRAILBASE_AUTH_COOKIE = 'bapx-trailbase-auth'

export function createClient() {
  const runtimeEnv = getEnv()
  const url = runtimeEnv.TRAILBASE_URL || 'http://localhost:4000'

  return initClient(url)
}
