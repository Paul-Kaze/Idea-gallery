import type { NextRequest } from 'next/server'
import { listImages } from '../../../lib/db'
import { captureServerError } from '../../../lib/monitoring'

function isDisplayableThumbnail(url: string | null | undefined) {
  if (!url) return false
  try {
    const parsed = new URL(url, 'http://localhost')
    return parsed.hostname !== 'example.com'
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') ?? '1')
    const size = Number(searchParams.get('size') ?? '20')

    const dbRes = await listImages(page, size)
    const items = dbRes.items
      .filter((it) => isDisplayableThumbnail(it.thumbnail_url))
      .map((it) => ({
        id: it.id,
        type: it.type,
        thumbnailUrl: it.thumbnail_url,
        model: it.model,
        width: it.width,
        height: it.height,
      }))

    return new Response(JSON.stringify({ items, total: dbRes.total, hasNext: dbRes.hasNext }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    await captureServerError('api.images_list_failed', error)
    return new Response(JSON.stringify({ items: [], total: 0, hasNext: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const revalidate = 60
