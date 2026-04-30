import { initClient } from 'trailbase'
import { cookies } from 'next/headers'
import { BAPX_TRAILBASE_AUTH_COOKIE } from './client'

export async function createClient() {
  const url = process.env.TRAILBASE_URL || 'http://localhost:4000'
  const cookieStore = await cookies()
  const token = cookieStore.get(BAPX_TRAILBASE_AUTH_COOKIE)?.value

  const client = initClient(url)
  if (token) {
    client.auth.setToken(token)
  }

  return client
}
