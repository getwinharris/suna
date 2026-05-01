import { beforeEach, describe, expect, test } from 'bun:test'

const ORIGINAL = {
  BAPX_TOKEN: process.env.BAPX_TOKEN,
  BAPX_YOLO_API_KEY: process.env.BAPX_YOLO_API_KEY,
  INTERNAL_SERVICE_KEY: process.env.INTERNAL_SERVICE_KEY,
  TUNNEL_TOKEN: process.env.TUNNEL_TOKEN,
}

beforeEach(() => {
  process.env.BAPX_TOKEN = ORIGINAL.BAPX_TOKEN
  process.env.BAPX_YOLO_API_KEY = ORIGINAL.BAPX_YOLO_API_KEY
  process.env.INTERNAL_SERVICE_KEY = ORIGINAL.INTERNAL_SERVICE_KEY
  process.env.TUNNEL_TOKEN = ORIGINAL.TUNNEL_TOKEN
})

describe('normalizeBootstrapAuthAliases', () => {
  test('forces BAPX_YOLO_API_KEY, INTERNAL_SERVICE_KEY, and TUNNEL_TOKEN to match BAPX_TOKEN', async () => {
    const { normalizeBootstrapAuthAliases } = await import('../../src/services/bootstrap-env')

    process.env.BAPX_TOKEN = 'bapx_sb_canonical'
    process.env.BAPX_YOLO_API_KEY = 'stale-yolo-key'
    process.env.INTERNAL_SERVICE_KEY = 'stale-inbound-key'
    process.env.TUNNEL_TOKEN = 'stale-tunnel-key'

    const updated = normalizeBootstrapAuthAliases()

    expect(updated).toBe(3)
    expect(process.env.BAPX_YOLO_API_KEY).toBe('bapx_sb_canonical')
    expect(process.env.INTERNAL_SERVICE_KEY).toBe('bapx_sb_canonical')
    expect(process.env.TUNNEL_TOKEN).toBe('bapx_sb_canonical')
  })
})
