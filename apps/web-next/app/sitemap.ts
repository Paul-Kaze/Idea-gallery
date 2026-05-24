import type { MetadataRoute } from 'next'
import { getAbsoluteUrl } from '../lib/site'
import { MODEL_INDEX_ITEMS } from './m/model-data'

const staticRoutes = [
  '/',
  '/assets',
  '/tools',
  '/tools/ai-baby-generator',
  '/tools/baby-photos',
  '/ai-baby-generator',
  '/future-baby-generator',
  '/baby-ai-generator-free',
  '/ai-baby-face-generator-free',
  '/what-will-my-baby-look-like',
  '/ideas/couple-photoshoot-ideas',
  '/ideas/engagement-photoshoot-ideas',
  '/ideas/valentine-photoshoot-ideas',
  '/ideas/anniversary-photo-ideas',
  '/ideas/couple-photoshoot-poses',
  '/m',
  '/legal',
  '/legal/terms',
  '/legal/privacy',
  '/legal/refund',
  '/legal/ai-content-policy',
  '/legal/deletion-policy',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const modelRoutes = MODEL_INDEX_ITEMS.map((item) => item.href)
  const routes = Array.from(new Set([...staticRoutes, ...modelRoutes]))

  return routes.map((route) => ({
    url: getAbsoluteUrl(route),
    lastModified,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : route.startsWith('/m/') ? 0.8 : 0.7,
  }))
}
