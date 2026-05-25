import { GET, dedupeDisplayableItems, isDisplayableThumbnail } from '../../app/api/images/route'

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

  it('filters seeded placeholder thumbnails', () => {
    expect(isDisplayableThumbnail('https://gallery-paul.oss-ap-southeast-1.aliyuncs.com/gallery/img_1_thumb')).toBe(false)
    expect(isDisplayableThumbnail('/api/download?key=gallery%2Fe0810e9c-cfe7-42b4-bba9-1a55328668aa_thumb.png')).toBe(true)
    expect(isDisplayableThumbnail('https://gallery-paul.oss-ap-southeast-1.aliyuncs.com/gallery/real_thumb.webp')).toBe(true)
  })

  it('deduplicates images with the same generated content', () => {
    const items = dedupeDisplayableItems([
      {
        id: 'first',
        type: 'image',
        thumbnail_url: '/api/download?key=gallery%2Ffirst_thumb.png',
        model: 'Midjourney v6',
        prompt: 'same prompt',
        width: 928,
        height: 1232,
      },
      {
        id: 'duplicate',
        type: 'image',
        thumbnail_url: '/api/download?key=gallery%2Fsecond_thumb.png',
        model: 'Midjourney v6',
        prompt: 'same prompt',
        width: 928,
        height: 1232,
      },
    ])

    expect(items).toHaveLength(1)
    expect(items[0].id).toBe('first')
  })
})
