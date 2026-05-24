import { GET } from '../../app/api/images/[id]/route'

describe('GET /api/images/:id', () => {
  it('returns 404 for unknown id', async () => {
    const res = await GET(new Request('http://localhost'), { params: { id: 'unknown' } })
    expect(res.status).toBe(404)
  })

  it('returns 404 when production data is not configured for id', async () => {
    const res = await GET(new Request('http://localhost'), { params: { id: '1' } })
    expect(res.status).toBe(404)
  })
})
