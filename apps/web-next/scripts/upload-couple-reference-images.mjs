import fs from 'node:fs/promises'
import path from 'node:path'
import dotenv from 'dotenv'
import OSS from 'ali-oss'

const projectRoot = '/Users/lizi/Desktop/trae_projects/Idea Gallery'
const portraitDir = path.join(projectRoot, 'local-test-assets', 'diverse-clean-portraits')
const outputDir = path.join(projectRoot, 'local-test-assets', 'couple-private-album')
const referenceUrlsPath = path.join(outputDir, 'reference_image_urls.json')

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

const referenceMap = JSON.parse(await fs.readFile(referenceUrlsPath, 'utf8'))

for (const fileName of Object.keys(referenceMap)) {
  if (referenceMap[fileName]) {
    console.log(`[skip] ${fileName}`)
    continue
  }

  const localPath = path.join(portraitDir, fileName)
  const buffer = await fs.readFile(localPath)
  const key = `local-test-assets/couple-private-album/reference/${fileName}`
  const mime = guessMime(fileName)

  console.log(`[upload] ${fileName}`)
  const result = await client.put(key, buffer, {
    mime,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })

  referenceMap[fileName] = result.url || `https://${process.env.OSS_BUCKET}.${process.env.OSS_ENDPOINT}/${key}`
}

await fs.writeFile(referenceUrlsPath, JSON.stringify(referenceMap, null, 2) + '\n', 'utf8')
console.log('[done] uploaded reference images')
