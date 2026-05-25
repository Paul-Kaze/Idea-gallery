import fs from 'node:fs/promises'
import path from 'node:path'
import dotenv from 'dotenv'
import OSS from 'ali-oss'

const projectRoot = '/Users/lizi/Desktop/trae_projects/Idea Gallery'
const referenceDir = path.join(projectRoot, 'local-test-assets', 'gpt-image-2-couple-poses', 'references')
const outputPath = path.join(projectRoot, 'local-test-assets', 'gpt-image-2-couple-poses', 'reference_image_urls.json')

dotenv.config({ path: path.join(projectRoot, '.env') })

function ensure(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env: ${name}`)
  return value
}

function guessMime(fileName) {
  const lower = fileName.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  return 'application/octet-stream'
}

function publicUrlFor(key) {
  const endpoint = ensure('OSS_ENDPOINT').replace(/^https?:\/\//, '')
  return `https://${ensure('OSS_BUCKET')}.${endpoint}/${key}`
}

const client = new OSS({
  endpoint: ensure('OSS_ENDPOINT'),
  region: ensure('OSS_REGION'),
  accessKeyId: ensure('OSS_ACCESS_KEY_ID'),
  accessKeySecret: ensure('OSS_ACCESS_KEY_SECRET'),
  bucket: ensure('OSS_BUCKET'),
})

let existing = {}
try {
  existing = JSON.parse(await fs.readFile(outputPath, 'utf8'))
} catch {
  existing = {}
}

const files = (await fs.readdir(referenceDir)).filter((file) => /\.(jpe?g|png|webp)$/i.test(file)).sort()
const referenceMap = { ...existing }

for (const fileName of files) {
  if (referenceMap[fileName]) {
    console.log(`[skip] ${fileName}`)
    continue
  }

  const localPath = path.join(referenceDir, fileName)
  const buffer = await fs.readFile(localPath)
  const key = `local-test-assets/gpt-image-2-couple-poses/references/${fileName}`

  console.log(`[upload] ${fileName}`)
  const result = await client.put(key, buffer, {
    mime: guessMime(fileName),
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })

  referenceMap[fileName] = result.url || publicUrlFor(key)
}

await fs.writeFile(outputPath, JSON.stringify(referenceMap, null, 2) + '\n', 'utf8')
console.log(`[done] wrote ${outputPath}`)
