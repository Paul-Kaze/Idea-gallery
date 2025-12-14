import { NextRequest } from 'next/server'
import { listImages } from '../../../lib/db'

type ListItem = {
  id: string
  type: 'image' | 'video'
  thumbnailUrl: string
  model: string
  width: number
  height: number
}

const MOCK: ListItem[] = [
  {
    id: '1',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800',
    model: 'Gemini 3 Pro',
    width: 1200,
    height: 1600,
  },
  {
    id: '2',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1705254613735-1abb457f8a60?w=800',
    model: 'DALL-E 4',
    width: 1200,
    height: 800,
  },
  {
    id: 'v1',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535016120720-40c6874c3b13?w=800',
    model: 'Sora v1',
    width: 1920,
    height: 1080,
  },
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)//从请求URL中获取查询参数，例如：/api/images?page=1&size=20
  // 从查询参数中获取分页信息，默认第1页，每页20项
  const page = Number(searchParams.get('page') ?? '1')
  const size = Number(searchParams.get('size') ?? '20')

  const dbRes = await listImages(page, size)
  const items = dbRes.items.length
    ? dbRes.items.map((it) => ({
        id: it.id,
        type: it.type,
        thumbnailUrl: it.thumbnail_url,
        model: it.model,
        width: it.width,
        height: it.height,
      }))
    : MOCK.slice((page - 1) * size, (page - 1) * size + size).map((it) => ({
        id: it.id,
        type: it.type,
        thumbnailUrl: it.thumbnailUrl,
        model: it.model,
        width: it.width,
        height: it.height,
      }))

  const total = dbRes.items.length ? dbRes.total : MOCK.length
  const hasNext = dbRes.items.length ? dbRes.hasNext : (page - 1) * size + size < MOCK.length

  return new Response(JSON.stringify({ items, total, hasNext }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
export const revalidate = 60
