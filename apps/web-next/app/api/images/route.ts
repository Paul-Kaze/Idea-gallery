import type { NextRequest } from 'next/server'
import type { ListItem } from '../../../lib/db'
import { listImages } from '../../../lib/db'
import { captureServerError } from '../../../lib/monitoring'

export function isDisplayableThumbnail(url: string | null | undefined) {
  if (!url) return false
  try {
    const parsed = new URL(url, 'http://localhost')
    if (parsed.hostname === 'example.com') return false
    if (/\/gallery\/img_\d+_thumb$/i.test(parsed.pathname)) return false
    return true
  } catch {
    return false
  }
}

export function dedupeDisplayableItems(items: ListItem[]) {
  const seen = new Set<string>()

  return items.filter((item) => {
    if (!isDisplayableThumbnail(item.thumbnail_url)) return false

    const fingerprint = [
      item.type,
      item.model,
      item.width,
      item.height,
      item.prompt?.trim() || item.thumbnail_url,
    ].join('|')

    if (seen.has(fingerprint)) return false
    seen.add(fingerprint)
    return true
  })
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') ?? '1')
    const size = Number(searchParams.get('size') ?? '20')

    const dbRes = await listImages(page, size)
    const items = dedupeDisplayableItems(dbRes.items)
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
