import OSS from 'ali-oss'
import { Readable } from 'node:stream'
import dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })

let client: any
function ensureClient(bucket?: string): any | null {
  if (!process.env.OSS_ENDPOINT || !process.env.OSS_ACCESS_KEY_ID || !process.env.OSS_ACCESS_KEY_SECRET) return null
  if (!client) {
    client = new OSS({
      endpoint: process.env.OSS_ENDPOINT,
      region: process.env.OSS_REGION,
      accessKeyId: process.env.OSS_ACCESS_KEY_ID,
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
      bucket: process.env.OSS_BUCKET,
    })
  }
  if (bucket) client.useBucket(bucket)
  return client
}

export async function getDownloadResponse(key: string, bucket = process.env.OSS_BUCKET!): Promise<Response | null> {
  if (!bucket) return null
  const cli = ensureClient(bucket)
  if (!cli) return null
  const res = await cli.getStream(key).catch(() => null)
  if (!res || !res.stream) return null
  const web = (Readable as any).toWeb ? (Readable as any).toWeb(res.stream) : (res.stream as any)
  return new Response(web as ReadableStream, {
    headers: {
      'Content-Type': (res.res && (res.res.headers as any)['content-type']) || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${key.split('/').pop() || 'file'}"`,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

export async function getDownloadHeadResponse(key: string, bucket = process.env.OSS_BUCKET!): Promise<Response | null> {
  if (!bucket) return null
  const cli = ensureClient(bucket)
  if (!cli) return null
  const res = await cli.head(key).catch(() => null)
  if (!res) return null

  const headers: Record<string, string> = {
    'Cache-Control': 'public, max-age=31536000, immutable',
  }

  const ct = (res.res && (res.res.headers as any)['content-type']) || (res.headers && (res.headers as any)['content-type'])
  if (ct) headers['Content-Type'] = String(ct)
  const cl = (res.res && (res.res.headers as any)['content-length']) || (res.headers && (res.headers as any)['content-length'])
  if (cl) headers['Content-Length'] = String(cl)

  return new Response(null, { headers })
}

export async function uploadBufferToOSS(
  buffer: Buffer,
  key: string,
  mimeType: string = 'image/jpeg',
  bucket = process.env.OSS_BUCKET!
): Promise<string | null> {
  if (!bucket) return null
  const cli = ensureClient(bucket)
  if (!cli) return null

  try {
    const result = await cli.put(key, buffer, {
      mime: mimeType,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      }
    })

    // Some OSS SDK versions or configurations might not return `url` directly,
    // so we provide a fallback constructed from endpoint and bucket.
    return result.url || `https://${bucket}.${process.env.OSS_ENDPOINT}/${key}`
  } catch (err) {
    console.error('[OSS Upload Error]', err)
    return null
  }
}
