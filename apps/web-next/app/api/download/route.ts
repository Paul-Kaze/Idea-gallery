import { NextRequest } from 'next/server'
import { getDownloadHeadResponse, getDownloadResponse } from '../../../lib/storage'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  const bucket = searchParams.get('bucket') ?? process.env.OSS_BUCKET
  const id = searchParams.get('id')
  const type = searchParams.get('type') ?? 'original'

  if (key) {
    const mocked = (globalThis as any).__mockDownloadResponse as Response | undefined
    if (mocked) return mocked
    const res = await getDownloadResponse(key, bucket || undefined).catch(() => null)
    if (res) return res
    return new Response('Not Found', { status: 404 })
  }

  if (!id) return new Response('Bad Request', { status: 400 })

  // If OSS is configured, stream the object; else redirect to a public asset
  const prefix = process.env.OSS_KEY_PREFIX
  const objKey = prefix ? `${prefix}/${id}${type === 'thumb' ? '_thumb' : ''}` : null
  if (objKey) {
    const mocked = (globalThis as any).__mockDownloadResponse as Response | undefined
    if (mocked) return mocked
    const res = await getDownloadResponse(objKey).catch(() => null)
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

export async function HEAD(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  const bucket = searchParams.get('bucket') ?? process.env.OSS_BUCKET
  const id = searchParams.get('id')
  const type = searchParams.get('type') ?? 'original'

  const prefix = process.env.OSS_KEY_PREFIX
  const objKey = key || (id && prefix ? `${prefix}/${id}${type === 'thumb' ? '_thumb' : ''}` : null)
  if (!objKey) return new Response(null, { status: 400 })

  const mocked = (globalThis as any).__mockDownloadResponse as Response | undefined
  if (mocked) return new Response(null, { headers: mocked.headers })

  const res = await getDownloadHeadResponse(objKey, bucket || undefined).catch(() => null)
  if (res) return res
  return new Response(null, { status: 404 })
}
