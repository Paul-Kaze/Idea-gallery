import { GET } from '../../app/api/images/[id]/route'

describe('GET /api/images/:id', () => {
  it('returns 404 for unknown id', async () => {
    const res = await GET(new Request('http://localhost'), { params: { id: 'unknown' } })
    expect(res.status).toBe(404)
  })

  it('returns detail for mocked id', async () => {
    const res = await GET(new Request('http://localhost'), { params: { id: '1' } })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.id).toBe('1')
    expect(data.fullUrl).toBeTruthy()
    expect(data.model).toBeTruthy()
    expect(data.prompt).toBeTruthy()
  })
})
