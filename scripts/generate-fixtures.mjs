import fs from 'fs'
import path from 'path'

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const models = ['Gemini 3 Pro', 'DALL-E 4', 'Midjourney v7', 'Stable Diffusion XL', 'Sora v1', 'Runway Gen-2']
const prompts = [
  'Futuristic cityscape with neon reflections and flying cars',
  'Abstract colorful swirls and vibrant gradients',
  'Fantasy landscape with mystical mountains and aurora',
  'Digital portrait with holographic geometric patterns',
  'Cyberpunk street scene with rain-soaked pavement',
  'Surreal dreamscape with floating islands and impossible architecture',
  'Cosmic universe with swirling galaxies and nebula',
  'Majestic mountains at sunset with golden hour lighting',
  'Underwater ocean scene with coral reefs and sun rays',
  'Northern lights dancing in starry sky'
]

function genImages(count = 120) {
  const items = []
  for (let i = 1; i <= count; i++) {
    const isVideo = i % 10 === 0
    const w = 800 + ((i * 37) % 1120)
    const h = 600 + ((i * 29) % 900)
    const id = `img_${i}`
    items.push({
      id,
      type: isVideo ? 'video' : 'image',
      model: pick(models),
      prompt: `${pick(prompts)} — case #${i}`,
      thumbnail_url: `https://example.com/thumbnails/${id}.${isVideo ? 'jpg' : 'jpg'}`,
      full_url: `https://example.com/originals/${id}.${isVideo ? 'mp4' : 'jpg'}`,
      width: w,
      height: h,
      duration: isVideo ? `${Math.floor(10 + (i % 50))}s` : null,
      uploaded_at: new Date(Date.now() - i * 3600_000).toISOString(),
      user_id: null,
    })
  }
  return items
}

function genReferences(images) {
  const refs = []
  for (const img of images) {
    const refCount = (img.id.endsWith('1') || img.id.endsWith('5')) ? 2 : (img.id.endsWith('0') ? 3 : 0)
    for (let r = 0; r < refCount; r++) {
      const rid = `${img.id}_ref_${r + 1}`
      refs.push({
        id: rid,
        path: `refs/${rid}.jpg`,
        url: `https://example.com/refs/${rid}.jpg`,
        target_image_id: img.id,
      })
    }
  }
  return refs
}

function genUsers(count = 10) {
  const users = []
  for (let i = 1; i <= count; i++) {
    users.push({
      id: `u_${i.toString().padStart(3, '0')}`,
      name: `User ${i}`,
      avatar_url: `https://example.com/avatars/u_${i}.png`,
      created_at: new Date().toISOString(),
      expires_at: null,
    })
  }
  return users
}

const outDir = path.resolve(process.cwd(), 'test/fixtures')
ensureDir(outDir)
const images = genImages(120)
const references = genReferences(images)
const users = genUsers(10)

fs.writeFileSync(path.join(outDir, 'images.json'), JSON.stringify(images, null, 2))
fs.writeFileSync(path.join(outDir, 'reference_images.json'), JSON.stringify(references, null, 2))
fs.writeFileSync(path.join(outDir, 'users.json'), JSON.stringify(users, null, 2))

console.log(`Generated fixtures: images(${images.length}), references(${references.length}), users(${users.length}) at ${outDir}`)
