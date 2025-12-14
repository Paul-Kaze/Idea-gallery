import { afterEach, vi } from 'vitest'

import { __setSupabaseAdmin } from '../../lib/db'
__setSupabaseAdmin({
  from() {
    return {
      select() {
        return {
          eq() {
            return {
              limit() {
                return {
                  maybeSingle() {
                    return Promise.resolve({
                      data: {
                        id: 'm1',
                        type: 'image',
                        full_url: 'https://example.com/m1.jpg',
                        model: 'Mock',
                        prompt: 'Prompt',
                        width: 100,
                        height: 100,
                        duration: null,
                      },
                      error: null,
                    })
                  },
                }
              },
            }
          },
        }
      },
    }
  },
})

afterEach(() => {})

describe('GET /api/images/:id with db mocked', () => {
  it('returns detail from db branch', async () => {
    const mod = await import('../../app/api/images/[id]/route')
    const res = await mod.GET(new Request('http://localhost'), { params: { id: 'm1' } })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.id).toBe('m1')
    expect(data.fullUrl).toContain('example.com')
  })
})
