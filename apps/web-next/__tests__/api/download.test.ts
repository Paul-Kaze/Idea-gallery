import { GET } from '../../app/api/download/route'

describe('GET /api/download', () => {
  it('400 without id', async () => {
    const res = await GET(new Request('http://localhost/api/download'))
    expect(res.status).toBe(400)
  })

  it('302 redirect for mocked id', async () => {
    const res = await GET(new Request('http://localhost/api/download?id=1&type=original'))
    expect(res.status).toBe(302)
    const loc = res.headers.get('Location')
    expect(loc).toContain('images.unsplash.com')
  })
})
