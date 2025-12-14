import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: process.env.AWS_ACCESS_KEY_ID
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }
    : undefined,
})

export async function getDownloadResponse(key: string, bucket = process.env.AWS_S3_BUCKET!): Promise<Response | null> {
  if (!bucket || !process.env.AWS_REGION) return null
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key })
  const obj = await s3.send(cmd)
  const body = obj.Body as any
  if (!body) return null
  return new Response(body as ReadableStream, {
    headers: {
      'Content-Type': obj.ContentType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${key.split('/').pop() || 'file'}"`,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
