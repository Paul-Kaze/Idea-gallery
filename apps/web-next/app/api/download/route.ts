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

  // If OSS is configured, stream the object.
  const prefix = process.env.OSS_KEY_PREFIX
  const objKey = prefix ? `${prefix}/${id}${type === 'thumb' ? '_thumb' : ''}` : null
  if (objKey) {
    const mocked = (globalThis as any).__mockDownloadResponse as Response | undefined
    if (mocked) return mocked
    const res = await getDownloadResponse(objKey).catch(() => null)
    if (res) return res
  }

  return new Response('Not Found', { status: 404 })
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
