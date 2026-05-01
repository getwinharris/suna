import 'server-only'

import { parseRuntimeEnv, type RuntimeEnv } from '@/lib/env-schema'

export type PublicRuntimeEnv = RuntimeEnv

function read(name: string): string | undefined {
  return process.env[`BAPX_PUBLIC_${name}`] ?? process.env[`NEXT_PUBLIC_${name}`]
}

export function getServerPublicEnv(): PublicRuntimeEnv {
  return parseRuntimeEnv({
    TRAILBASE_URL: read('TRAILBASE_URL') || process.env.TRAILBASE_PUBLIC_URL || process.env.TRAILBASE_URL,
    TRAILBASE_ANON_KEY: read('TRAILBASE_ANON_KEY') || process.env.TRAILBASE_ANON_KEY,
    BACKEND_URL: read('BACKEND_URL') || process.env.BACKEND_URL,
    ENV_MODE: (read('ENV_MODE') || 'local') as 'local' | 'cloud',
    APP_URL: read('APP_URL') || process.env.PUBLIC_URL,
    SANDBOX_ID: read('SANDBOX_ID') || undefined,
  })
}
