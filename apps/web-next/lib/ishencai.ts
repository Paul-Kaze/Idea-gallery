import { uploadBufferToOSS } from './storage'
import type { YunwuGenerateInput, YunwuGenerationResult } from './yunwu'

const DEFAULT_ENDPOINT = 'https://restapidev.ishencai.com/admin/api/ai/media/generate-sync'

const ISHENCAI_IMAGE_MODELS: Record<string, string> = {
  'gpt-image-2': 'GPT Image 2',
  'seedream-5-0': 'Seedream 5.0',
  'seedream-5': 'Seedream 5.0',
}

function normalizeModelSlug(model: string) {
  return model
    .trim()
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

function dataUrlToBuffer(dataURL: string) {
  const match = dataURL.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) throw new Error('Image data must be a public URL or a base64 data URL.')
  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], 'base64'),
  }
}

function getEndpoint() {
  return process.env.ISHENCAI_ENDPOINT || DEFAULT_ENDPOINT
}

function getApiKey() {
  return process.env.ISHENCAI_API_KEY || process.env.GPT_IMAGE_2_API_KEY
}

function getIshencaiModelType(model: string) {
  return ISHENCAI_IMAGE_MODELS[normalizeModelSlug(model)]
}

export function isIshencaiImageModel(model: string) {
  return Boolean(getIshencaiModelType(model))
}

async function uploadDataUrlImage(dataURL: string, name: string) {
  const { buffer, mimeType } = dataUrlToBuffer(dataURL)
  const ext = mimeType.split('/')[1] || 'png'
  const prefix = process.env.OSS_KEY_PREFIX ? `${process.env.OSS_KEY_PREFIX}/` : ''
  const safeName = name.replace(/[^a-zA-Z0-9._-]+/g, '-')
  const key = `${prefix}model-generations/ishencai/${Date.now()}-${safeName}.${ext}`
  const url = await uploadBufferToOSS(buffer, key, mimeType)
  if (!url) throw new Error('iShencai image upload failed. Configure OSS before using data URL image responses.')
  return url
}

async function getReferenceImageUrls(referenceImages: YunwuGenerateInput['referenceImages'] = []) {
  const urls: string[] = []

  for (const image of referenceImages) {
    if (!image.dataURL) continue
    if (isHttpUrl(image.dataURL)) {
      urls.push(image.dataURL)
      continue
    }
    urls.push(await uploadDataUrlImage(image.dataURL, image.name || 'reference'))
  }

  return urls
}

function pickImageSource(item: unknown): string | undefined {
  if (typeof item === 'string' && (item.startsWith('data:') || isHttpUrl(item))) return item
  if (!item || typeof item !== 'object') return undefined

  const record = item as Record<string, unknown>
  for (const key of ['data_url', 'dataUrl', 'url', 'image_url', 'imageUrl']) {
    const value = record[key]
    if (typeof value === 'string' && (value.startsWith('data:') || isHttpUrl(value))) return value
  }
  return undefined
}

function findImageList(value: unknown): unknown[] | undefined {
  if (Array.isArray(value)) {
    if (value.length && value.every((item) => pickImageSource(item))) return value
    for (const item of value) {
      const found = findImageList(item)
      if (found) return found
    }
  }

  if (value && typeof value === 'object') {
    for (const nested of Object.values(value)) {
      const found = findImageList(nested)
      if (found) return found
    }
  }

  return undefined
}

async function resolveImageUrl(source: string, modelSlug: string) {
  if (isHttpUrl(source)) return source
  if (source.startsWith('data:')) return uploadDataUrlImage(source, `${modelSlug}-result`)
  return ''
}

export async function generateWithIshencai(input: YunwuGenerateInput): Promise<YunwuGenerationResult> {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('ISHENCAI_API_KEY is not configured.')

  const modelType = getIshencaiModelType(input.model)
  if (!modelType) throw new Error(`Unsupported iShencai image model: ${input.model}`)

  const modelSlug = normalizeModelSlug(input.model)
  const referenceUrls = await getReferenceImageUrls(input.referenceImages)
  const prompt = input.style && input.style !== 'Auto' ? `${input.prompt}\nStyle template: ${input.style}` : input.prompt
  const body = {
    funcParams: {
      modelType,
      prompt,
      resolution: input.resolution || (modelSlug === 'gpt-image-2' ? '4k' : '2k'),
      ratio: input.aspectRatio || '1:1',
      isFilterOff: true,
      extData: {
        quality: modelSlug === 'gpt-image-2' ? 'High' : 'Standard',
      },
      ...(referenceUrls.length ? { images: referenceUrls } : {}),
    },
  }

  const response = await fetch(getEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`iShencai request failed (${response.status}): ${message}`)
  }

  const raw = await response.json()
  const code = raw?.code
  if (typeof code === 'number' && ![0, 200].includes(code)) {
    throw new Error(`iShencai request failed (${code}): ${raw?.msg || raw?.message || 'Unknown API error'}`)
  }
  if (raw?.success === false) {
    throw new Error(`iShencai request failed: ${raw?.msg || raw?.message || 'Unknown API error'}`)
  }

  const images = findImageList(raw)
  const firstSource = images?.map((item) => pickImageSource(item)).find(Boolean)
  if (!firstSource) {
    throw new Error('iShencai did not return an image URL or data URL.')
  }

  const url = await resolveImageUrl(firstSource, modelSlug)
  if (!url) throw new Error('Unable to resolve iShencai image URL.')

  return {
    url,
    mediaType: 'image',
    provider: 'ishencai',
    endpoint: getEndpoint(),
    raw,
  }
}
