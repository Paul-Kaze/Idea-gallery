import { listImages, getImageDetail } from '../../lib/db'

describe('lib/db', () => {
  it('listImages returns mock when supabase not configured', async () => {
    const res = await listImages(1, 5)
    expect(Array.isArray(res.items)).toBe(true)
    expect(typeof res.total).toBe('number')
    expect(typeof res.hasNext).toBe('boolean')
  })

  it('getImageDetail returns null when supabase not configured', async () => {
    const res = await getImageDetail('non-existent')
    expect(res).toBeNull()
  })
})
