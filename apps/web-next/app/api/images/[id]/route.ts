type Detail = {
  id: string
  type: 'image' | 'video'
  fullUrl: string
  model: string
  prompt: string
  width: number
  height: number
  duration?: string
  reference_image?: string[]
}

const DETAILS: Record<string, Detail> = {
  '1': {
    id: '1',
    type: 'image',
    fullUrl:
      'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwY2l0eXNjYXBlfGVufDF8fHx8MTc2NDM5NDAzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    model: 'Gemini 3 Pro',
    prompt:
      'A futuristic cityscape at night with towering skyscrapers, neon lights reflecting on wet streets, flying cars in the sky, cyberpunk aesthetic, highly detailed, 8k resolution',
    width: 1200,
    height: 1600,
    reference_image: [
      'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400',
      'https://images.unsplash.com/photo-1529625052599-b9ea0f6bde34?w=400'
    ],
  },
}

import { NextRequest } from 'next/server'
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = await getImageDetail(id)
  if (db) {
    return new Response(JSON.stringify({
      id: db.id,
      type: db.type,
      fullUrl: db.full_url,
      model: db.model,
      prompt: db.prompt,
      width: db.width,
      height: db.height,
      duration: db.duration ?? undefined,
      reference_image: db.reference_image ?? [],
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=120, s-maxage=600, stale-while-revalidate=1200',
      },
    })
  }
  const detail = DETAILS[id]
  if (!detail) return new Response('Not Found', { status: 404 })
  return new Response(JSON.stringify(detail), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=120, s-maxage=600, stale-while-revalidate=1200',
    },
  })
}
import { getImageDetail } from '../../../../lib/db'
export const revalidate = 120
