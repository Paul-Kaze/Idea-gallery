import { vi } from 'vitest'

;(globalThis as any).__mockDownloadResponse = new Response('stream', { headers: { 'Content-Type': 'application/octet-stream' } })

describe('GET /api/download with oss mock', () => {
  it('streams from oss when configured', async () => {
    // @ts-ignore
    process.env.OSS_KEY_PREFIX = 'test-prefix'
    const mod = await import('../../app/api/download/route')
    const res = await mod.GET(new Request('http://localhost/api/download?id=1&type=thumb'))
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/octet-stream')
  })
})
