'use server'
import { createServerClient } from '@trailbase/ssr'
import { cookies } from 'next/headers'
import { BAPX_TRAILBASE_AUTH_COOKIE } from './constants'

export async function createClient() {
  const cookieStore = await cookies()

  // IMPORTANT: NEXT_PUBLIC_ vars are inlined at build time by Next.js, so in
  // Docker containers they contain placeholder values from the build host.
  // We MUST use non-NEXT_PUBLIC_ runtime env vars (TRAILBASE_URL, TRAILBASE_ANON_KEY)
  // which are read at runtime from process.env, falling back to NEXT_PUBLIC_ only
  // for dev mode where they match the actual Trailbase instance.
  //
  // TRAILBASE_SERVER_URL is the internal Docker network URL (e.g. http://trailbase-kong:8000)
  // used for server-side calls that run inside the Docker container.
  const trailbaseUrl = process.env.TRAILBASE_SERVER_URL || process.env.TRAILBASE_URL || process.env.NEXT_PUBLIC_TRAILBASE_URL!;
  const trailbaseAnonKey = process.env.TRAILBASE_ANON_KEY || process.env.NEXT_PUBLIC_TRAILBASE_ANON_KEY!;

  return createServerClient(
    trailbaseUrl,
    trailbaseAnonKey,
    {
      cookieOptions: {
        name: BAPX_TRAILBASE_AUTH_COOKIE,
        path: '/',
        sameSite: 'lax',
      },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
