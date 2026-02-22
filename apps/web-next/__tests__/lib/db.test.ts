import { listImages, getImageDetail, __setSupabaseAdmin } from '../../lib/db'
import { vi, describe, it, expect } from 'vitest'

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

  it('getImageDetail transforms reference_images table data', async () => {
    const mockData = {
      id: 'test-id',
      type: 'image',
      full_url: 'http://example.com/img.jpg',
      model: 'test-model',
      prompt: 'test prompt',
      width: 100,
      height: 100,
      reference_images: [
        { url: 'http://example.com/ref1.jpg' },
        { url: 'http://example.com/ref2.jpg' }
      ]
    }

    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: mockData, error: null })
    }

    __setSupabaseAdmin(mockSupabase)

    const res = await getImageDetail('test-id')
    expect(res).not.toBeNull()
    expect(res?.reference_image).toEqual([
      'http://example.com/ref1.jpg',
      'http://example.com/ref2.jpg'
    ])

    // Clean up
    __setSupabaseAdmin(undefined)
  })
})
