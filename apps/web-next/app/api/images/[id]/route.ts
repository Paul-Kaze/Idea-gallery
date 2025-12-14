type Detail = {
  id: string
  type: 'image' | 'video'
  fullUrl: string
  model: string
  prompt: string
  width: number
  height: number
  duration?: string
  references?: { id: string; thumbUrl: string; fullUrl: string }[]
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
    references: [
      {
        id: 'r1',
        thumbUrl: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400',
        fullUrl:
          'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
      },
    ],
  },
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const db = await getImageDetail(params.id)
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
      references: [],
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=120, s-maxage=600, stale-while-revalidate=1200',
      },
    })
  }
  const detail = DETAILS[params.id]
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
