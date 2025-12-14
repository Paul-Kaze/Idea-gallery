import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}
const supabase = createClient(url, key, { auth: { persistSession: false } })

const root = process.env.FIXTURES_ROOT || path.resolve(process.cwd(), '../../test/fixtures')
const imagesPath = path.join(root, 'images.json')
const refsPath = path.join(root, 'reference_images.json')
const usersPath = path.join(root, 'users.json')

function readJson(p) {
  if (!fs.existsSync(p)) return []
  return JSON.parse(fs.readFileSync(p, 'utf-8'))
}

const images = readJson(imagesPath)
const refs = readJson(refsPath)
const users = readJson(usersPath)

async function seedUsers() {
  if (!users.length) return
  const { error } = await supabase.from('users').insert(
    users.map(u => ({ name: u.name, avatar_url: u.avatar_url, expires_at: u.expires_at }))
  )
  if (error) throw error
  console.log(`Inserted users: ${users.length}`)
}

async function seedImages() {
  if (!images.length) return { inserted: [] }
  const payload = images.map(i => ({
    type: i.type,
    model: i.model,
    prompt: i.prompt,
    thumbnail_url: i.thumbnail_url,
    full_url: i.full_url,
    width: i.width,
    height: i.height,
    duration: i.duration,
    uploaded_at: i.uploaded_at ? new Date(i.uploaded_at).toISOString() : undefined,
    user_id: i.user_id || null,
  }))
  const { data, error } = await supabase.from('images').insert(payload).select('id, full_url')
  if (error) throw error
  console.log(`Inserted images: ${data.length}`)
  return { inserted: data }
}

async function seedReferences(inserted) {
  if (!refs.length || !inserted.length) return
  // Build mapping: original image id -> full_url
  const origIdToFull = new Map(images.map(i => [i.id, i.full_url]))
  // Build mapping: full_url -> inserted uuid id
  const fullUrlToInsertedId = new Map(inserted.map(r => [r.full_url, r.id]))
  const payload = refs
    .map(r => {
      const full = origIdToFull.get(r.target_image_id)
      const insertedId = full ? fullUrlToInsertedId.get(full) : undefined
      return insertedId ? { path: r.path, url: r.url, target_image_id: insertedId } : null
    })
    .filter(Boolean)
  if (!payload.length) return
  const { error } = await supabase.from('reference_images').insert(payload)
  if (error) throw error
  console.log(`Inserted reference images: ${payload.length}`)
}

;(async () => {
  try {
    await seedUsers()
    const { inserted } = await seedImages()
    await seedReferences(inserted)
    console.log('Seeding completed')
  } catch (e) {
    console.error('Seeding failed:', e)
    process.exit(1)
  }
})()
