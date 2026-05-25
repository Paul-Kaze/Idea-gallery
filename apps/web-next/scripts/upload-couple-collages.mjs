import fs from 'node:fs/promises'
import path from 'node:path'
import dotenv from 'dotenv'
import OSS from 'ali-oss'

const projectRoot = '/Users/lizi/Desktop/trae_projects/Idea Gallery'
const outputDir = path.join(projectRoot, 'local-test-assets', 'couple-private-album')
const manifestPath = path.join(outputDir, 'manifest.json')

dotenv.config({ path: path.join(projectRoot, '.env') })

function ensure(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env: ${name}`)
  }
  return value
}

function guessMime(fileName) {
  const lower = fileName.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  return 'application/octet-stream'
}

const client = new OSS({
  endpoint: ensure('OSS_ENDPOINT'),
  region: ensure('OSS_REGION'),
  accessKeyId: ensure('OSS_ACCESS_KEY_ID'),
  accessKeySecret: ensure('OSS_ACCESS_KEY_SECRET'),
  bucket: ensure('OSS_BUCKET'),
})

const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))

for (const item of manifest) {
  if (item.output_url) {
    console.log(`[skip] ${path.basename(item.output)}`)
    continue
  }

  const fileName = path.basename(item.output)
  const buffer = await fs.readFile(item.output)
  const key = `local-test-assets/couple-private-album/generated/${fileName}`
  const mime = guessMime(fileName)

  console.log(`[upload] ${fileName}`)
  const result = await client.put(key, buffer, {
    mime,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })

  item.output_url = result.url || `https://${process.env.OSS_BUCKET}.${process.env.OSS_ENDPOINT}/${key}`
}

await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8')
console.log('[done] uploaded generated collages')
