import { cookies } from 'next/headers'
import { BAPX_TRAILBASE_AUTH_COOKIE, createClient as createBrowserCompatibleClient } from './client'

export async function createClient() {
  const cookieStore = await cookies()
  const token = cookieStore.get(BAPX_TRAILBASE_AUTH_COOKIE)?.value

  return createBrowserCompatibleClient(token)
}
