import { parseRuntimeEnv, type RuntimeEnv } from '@/lib/env-schema'

declare global {
  interface Window {
    __BAPX_RUNTIME_CONFIG?: Partial<RuntimeEnv>
    __RUNTIME_ENV?: Partial<RuntimeEnv>
    __ENV_LOGGED__?: boolean
  }
}

function readRawEnv(): Partial<RuntimeEnv> {
  if (typeof window !== 'undefined') {
    if (window.__BAPX_RUNTIME_CONFIG) {
      return window.__BAPX_RUNTIME_CONFIG
    }
    if (window.__RUNTIME_ENV) {
      return window.__RUNTIME_ENV
    }
  }

  return {
    TRAILBASE_URL: process.env.BAPX_PUBLIC_TRAILBASE_URL || process.env.NEXT_PUBLIC_TRAILBASE_URL || process.env.TRAILBASE_URL,
    TRAILBASE_ANON_KEY: process.env.BAPX_PUBLIC_TRAILBASE_ANON_KEY || process.env.NEXT_PUBLIC_TRAILBASE_ANON_KEY || process.env.TRAILBASE_ANON_KEY,
    BACKEND_URL: process.env.BAPX_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL,
    ENV_MODE: (process.env.BAPX_PUBLIC_ENV_MODE || process.env.NEXT_PUBLIC_ENV_MODE) as 'local' | 'cloud' | undefined,
    APP_URL: process.env.BAPX_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_URL || process.env.PUBLIC_URL,
    SANDBOX_ID: process.env.BAPX_PUBLIC_SANDBOX_ID || process.env.NEXT_PUBLIC_SANDBOX_ID || undefined,
  }
}

function logRuntimeEnv(env: RuntimeEnv) {
  if (typeof window === 'undefined' || window.__ENV_LOGGED__) return
  window.__ENV_LOGGED__ = true
  console.info('[runtime-env]', {
    source: window.__BAPX_RUNTIME_CONFIG || window.__RUNTIME_ENV ? 'runtime-script' : 'fallback',
    trailbaseUrl: env.TRAILBASE_URL,
    backendUrl: env.BACKEND_URL,
    envMode: env.ENV_MODE,
    appUrl: env.APP_URL,
    anonKeyLength: env.TRAILBASE_ANON_KEY?.length ?? 0,
  })
}

export function getEnv(): RuntimeEnv {
  const runtimeEnv = parseRuntimeEnv(readRawEnv())
  logRuntimeEnv(runtimeEnv)
  return runtimeEnv
}

export const env = getEnv()
