import { GET } from '../../app/api/images/route'

describe('GET /api/images', () => {
  it('returns items with paging', async () => {
    const req = new Request('http://localhost/api/images?page=1&size=2')
    const res = await GET(req as any)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data.items)).toBe(true)
    expect(typeof data.total).toBe('number')
    expect(typeof data.hasNext).toBe('boolean')
  })
})
