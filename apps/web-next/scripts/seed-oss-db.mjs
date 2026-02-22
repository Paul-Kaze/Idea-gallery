import dotenv from 'dotenv'
import path from 'path'
// Load env from current dir and project root
dotenv.config()
dotenv.config({ path: path.resolve(process.cwd(), '../../.env'), override: true })
import OSS from 'ali-oss'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const ossEndpoint = process.env.OSS_ENDPOINT
const ossRegion = process.env.OSS_REGION
const ossBucket = process.env.OSS_BUCKET
const ossPrefix = process.env.OSS_KEY_PREFIX || 'ai-gallery'

function ensure(val, name) {
  if (!val) {
    console.error(`Missing ${name}`)
    process.exit(1)
  }
}

ensure(supabaseUrl, 'SUPABASE_URL')
ensure(supabaseKey, 'SUPABASE_SERVICE_ROLE_KEY')
ensure(ossEndpoint, 'OSS_ENDPOINT')
ensure(ossRegion, 'OSS_REGION')
ensure(ossBucket, 'OSS_BUCKET')

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
const oss = new OSS({
  endpoint: ossEndpoint,
  region: ossRegion,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: ossBucket,
})

function fixturesRoot() {
  return process.env.FIXTURES_ROOT || path.resolve(process.cwd(), '../../test/fixtures')
}

function readJson(p) {
  if (!fs.existsSync(p)) return []
  return JSON.parse(fs.readFileSync(p, 'utf-8'))
}

const root = fixturesRoot()
const images = readJson(path.join(root, 'images.json'))
const refs = readJson(path.join(root, 'reference_images.json'))
const users = readJson(path.join(root, 'users.json'))

function groupRefsByImageId() {
  const g = new Map()
  for (const r of refs) {
    const arr = g.get(r.target_image_id) || []
    arr.push(r)
    g.set(r.target_image_id, arr)
  }
  return g
}

function endpointHost(ep) {
  try {
    return new URL(ep).host
  } catch {
    return String(ep).replace(/^https?:\/\//, '')
  }
}
function ossPublicUrl(key) {
  const host = endpointHost(ossEndpoint)
  return `https://${ossBucket}.${host}/${key}`
}

function svgPlaceholder({ w = 256, h = 256, text = 'AI Gallery' }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f3f4f6"/>
      <stop offset="100%" stop-color="#d1d5db"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="50%" font-size="${Math.floor(Math.min(w,h)/10)}" text-anchor="middle" fill="#111827" dy=".3em" font-family="system-ui, -apple-system">${text}</text>
</svg>`
}

async function putImage(key, { w, h, text }) {
  const svg = svgPlaceholder({ w, h, text })
  const buf = Buffer.from(svg, 'utf-8')
  await oss.put(key, buf, { headers: { 'Content-Type': 'image/svg+xml' } })
}

async function putVideoFromUrl(key, url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Fetch sample mp4 failed: ${res.status}`)
  const arrayBuffer = await res.arrayBuffer()
  const buf = Buffer.from(arrayBuffer)
  await oss.put(key, buf, { headers: { 'Content-Type': 'video/mp4' } })
}

async function seedUsers() {
  if (!users.length) return
  const { error } = await supabase.from('users').insert(
    users.map(u => ({ name: u.name, avatar_url: u.avatar_url, expires_at: u.expires_at }))
  )
  if (error) throw error
  console.log(`Inserted users: ${users.length}`)
}

async function seedBatch({ limit = 20 } = {}) {
  const grouped = groupRefsByImageId()
  const picked = images.filter(i => i.type === 'image').slice(0, limit)

  const payload = []
  const refMap = new Map() // full_url -> { urls: string[], paths: string[] }
  for (const it of picked) {
    const baseKey = `${ossPrefix}/${it.id}`
    const thumbKey = `${baseKey}_thumb`
    const refsFor = grouped.get(it.id) || []
    const refKeys = refsFor.map(r => `${ossPrefix}/refs/${r.id}`)
    const refPaths = refsFor.map(r => `refs/${r.id}`)

    await putImage(baseKey, { w: it.width, h: it.height, text: it.id })
    await putImage(thumbKey, { w: Math.max(200, Math.floor(it.width / 2)), h: Math.max(200, Math.floor(it.height / 2)), text: `${it.id} thumb` })
    for (const k of refKeys) {
      await putImage(k, { w: 256, h: 256, text: k.split('/').pop() })
    }

    const fullUrl = ossPublicUrl(baseKey)
    const thumbUrl = ossPublicUrl(thumbKey)
    const refUrls = refKeys.map(ossPublicUrl)
    refMap.set(fullUrl, { urls: refUrls, paths: refPaths })

    payload.push({
      type: it.type,
      model: it.model,
      prompt: it.prompt,
      thumbnail_url: thumbUrl,
      full_url: fullUrl,
      width: it.width,
      height: it.height,
      duration: it.duration,
      uploaded_at: it.uploaded_at ? new Date(it.uploaded_at).toISOString() : undefined,
      user_id: it.user_id || null,
      reference_image: refUrls,
    })
  }

  // Insert images without reference_image column (enforcing new schema)
  const payloadNoRef = payload.map(p => {
    const { reference_image, ...rest } = p
    return rest
  })

  const { data: inserted, error } = await supabase.from('images').insert(payloadNoRef).select('id, full_url')
  if (error) throw error
  console.log(`Inserted images: ${inserted.length}`)

  // Now insert reference_images rows
  const refRows = []
  for (const row of inserted) {
    const refs = refMap.get(row.full_url)
    if (!refs) continue
    for (let i = 0; i < refs.urls.length; i++) {
      refRows.push({ path: refs.paths[i], url: refs.urls[i], target_image_id: row.id })
    }
  }

  if (refRows.length) {
    const { error: e2 } = await supabase.from('reference_images').insert(refRows)
    if (e2) throw e2
    console.log(`Inserted reference_images rows: ${refRows.length}`)
  }
}

;(async () => {
  try {
    console.log('Starting upload to OSS and seeding DB...')
    await seedUsers()
    await seedBatch({ limit: Number(process.env.SEED_LIMIT || '24') })
    console.log('Seeding completed')
  } catch (e) {
    console.error('Seeding failed:', e)
    process.exit(1)
  }
})()
