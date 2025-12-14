import { NextRequest } from 'next/server'
import { getDownloadResponse } from '../../../lib/storage'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const type = searchParams.get('type') ?? 'original'

  if (!id) return new Response('Bad Request', { status: 400 })

  // If S3 is configured, stream the object; else redirect to a public asset
  const s3Key = process.env.AWS_S3_KEY_PREFIX ? `${process.env.AWS_S3_KEY_PREFIX}/${id}${type === 'thumb' ? '_thumb' : ''}` : null
  if (s3Key) {
    const mocked = (globalThis as any).__mockDownloadResponse as Response | undefined
    if (mocked) return mocked
    const res = await getDownloadResponse(s3Key).catch(() => null)
    if (res) return res
  }

  // Mock: redirect to a public asset based on id/type
  const urlMap: Record<string, { original: string; thumb: string }> = {
    '1': {
      original:
        'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwY2l0eXNjYXBlfGVufDF8fHx8MTc2NDM5NDAzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      thumb: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800',
    },
  }

  const url = urlMap[id]?.[type as 'original' | 'thumb']
  if (!url) return new Response('Not Found', { status: 404 })

  return Response.redirect(url)
}
