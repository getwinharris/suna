import { z } from 'zod'

const RuntimeEnvSchema = z.object({
  TRAILBASE_URL: z.string().url('TRAILBASE_URL must be a valid URL').optional(),
  TRAILBASE_ANON_KEY: z.string().min(1, 'TRAILBASE_ANON_KEY is required').optional(),
  BACKEND_URL: z.string().url('BACKEND_URL must be a valid URL'),
  ENV_MODE: z.enum(['local', 'cloud']).default('local'),
  APP_URL: z.string().url('APP_URL must be a valid URL').default('http://localhost:3000'),
  /** Default sandbox container name — used as fallback before the store hydrates */
  SANDBOX_ID: z.string().optional().default('bapx-sandbox'),
})

export type RuntimeEnv = z.infer<typeof RuntimeEnvSchema>

export function parseRuntimeEnv(raw: Partial<RuntimeEnv>): RuntimeEnv {
  return RuntimeEnvSchema.parse({
    ENV_MODE: 'local',
    ...raw,
  })
}
