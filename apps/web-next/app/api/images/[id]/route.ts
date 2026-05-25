import type { NextRequest } from 'next/server'
import { getImageDetail } from '../../../../lib/db'
import { captureServerError } from '../../../../lib/monitoring'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getImageDetail(id)

    if (!db) return new Response('Not Found', { status: 404 })

    return new Response(JSON.stringify({
      id: db.id,
      type: db.type,
      fullUrl: db.full_url,
      model: db.model,
      prompt: db.prompt,
      duration: db.duration ?? undefined,
      reference_image: db.reference_image ?? [],
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=120, s-maxage=600, stale-while-revalidate=1200',
      },
    })
  } catch (error) {
    await captureServerError('api.image_detail_failed', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

export const revalidate = 120
