import { uploadBufferToOSS } from './storage'

export type YunwuGenerationKind = 'image' | 'video'

export type YunwuGenerateInput = {
  kind: YunwuGenerationKind
  prompt: string
  model: string
  mode?: string
  aspectRatio?: string
  duration?: number
  resolution?: string
  count?: number
  style?: string
  referenceImages?: Array<{
    name?: string
    type?: string
    dataURL: string
  }>
}

export type YunwuGenerationResult = {
  url: string
  mediaType: YunwuGenerationKind
  provider: 'yunwu' | 'ishencai'
  endpoint: string
  taskId?: string
  raw: unknown
}

const DEFAULT_BASE_URL = 'https://api.zhongzhuan.chat'
const MAX_POLL_ATTEMPTS = 36
const POLL_INTERVAL_MS = 2500
const VIDU_REFERENCE_TO_VIDEO_ENDPOINT = '/ent/v2/reference2video'
const KLING_IMAGE_GENERATIONS_ENDPOINT = '/kling/v1/images/generations'
const KLING_MULTI_IMAGE_ENDPOINT = '/kling/v1/images/multi-image2image'
const KLING_TEXT_TO_VIDEO_ENDPOINT = '/kling/v1/videos/text2video'
const KLING_IMAGE_TO_VIDEO_ENDPOINT = '/kling/v1/videos/image2video'

type ImageModelEndpoint = {
  endpoint: string
  modelName?: string
  multiReferenceEndpoint?: string
  multiReferenceModelName?: string
}

const IMAGE_MODEL_ENDPOINTS: Record<string, ImageModelEndpoint> = {
  'seedream-4-5': { endpoint: '/fal-ai/bytedance/seedream/v4/text-to-image' },
  'seedream-4-0': { endpoint: '/fal-ai/bytedance/seedream/v4/text-to-image' },
  'nano-banana-pro': { endpoint: '/fal-ai/bytedance/seedream/v4/text-to-image' },
  'nano-banana-2': { endpoint: '/fal-ai/bytedance/seedream/v4/text-to-image' },
  'nano-banana': { endpoint: '/fal-ai/bytedance/seedream/v4/text-to-image' },
  'gpt-image-2': { endpoint: '/fal-ai/bytedance/seedream/v4/text-to-image' },
  'kling-image': {
    endpoint: KLING_IMAGE_GENERATIONS_ENDPOINT,
    modelName: 'kling-v1',
    multiReferenceEndpoint: KLING_MULTI_IMAGE_ENDPOINT,
    multiReferenceModelName: 'kling-v2',
  },
  'kling-v1-image': {
    endpoint: KLING_IMAGE_GENERATIONS_ENDPOINT,
    modelName: 'kling-v1',
    multiReferenceEndpoint: KLING_MULTI_IMAGE_ENDPOINT,
    multiReferenceModelName: 'kling-v2',
  },
  'kling-v2-reference-image': {
    endpoint: KLING_IMAGE_GENERATIONS_ENDPOINT,
    modelName: 'kling-v1',
    multiReferenceEndpoint: KLING_MULTI_IMAGE_ENDPOINT,
    multiReferenceModelName: 'kling-v2',
  },
}

const VIDEO_MODEL_ENDPOINTS: Record<string, { text: string; image: string; modelName?: string; reference?: string; referenceModel?: string }> = {
  'kling-video': {
    text: KLING_TEXT_TO_VIDEO_ENDPOINT,
    image: KLING_IMAGE_TO_VIDEO_ENDPOINT,
    modelName: 'kling-v1',
  },
  'kling-v1-video': {
    text: KLING_TEXT_TO_VIDEO_ENDPOINT,
    image: KLING_IMAGE_TO_VIDEO_ENDPOINT,
    modelName: 'kling-v1',
  },
  'kling-2-5-turbo-pro': {
    text: '/fal-ai/kling-video/v2.5-turbo/pro/text-to-video',
    image: '/fal-ai/kling-video/v2.5-turbo/pro/image-to-video',
  },
  'seedance-3-0': {
    text: '/fal-ai/kling-video/v2.5-turbo/pro/text-to-video',
    image: '/fal-ai/kling-video/v2.5-turbo/pro/image-to-video',
  },
  'seedance-2-0': {
    text: '/fal-ai/kling-video/v2.5-turbo/pro/text-to-video',
    image: '/fal-ai/kling-video/v2.5-turbo/pro/image-to-video',
  },
  'seedance-2-0-fast': {
    text: '/fal-ai/kling-video/v2.5-turbo/pro/text-to-video',
    image: '/fal-ai/kling-video/v2.5-turbo/pro/image-to-video',
  },
  'seedance-1-5-pro': {
    text: '/fal-ai/kling-video/v2.5-turbo/pro/text-to-video',
    image: '/fal-ai/kling-video/v2.5-turbo/pro/image-to-video',
  },
  'seedance-1-0-pro': {
    text: '/fal-ai/kling-video/v2.5-turbo/pro/text-to-video',
    image: '/fal-ai/kling-video/v2.5-turbo/pro/image-to-video',
  },
  'seedance-1-0-pro-fast': {
    text: '/fal-ai/kling-video/v2.5-turbo/pro/text-to-video',
    image: '/fal-ai/kling-video/v2.5-turbo/pro/image-to-video',
  },
  'seedance-1-0-lite': {
    text: '/fal-ai/kling-video/v2.5-turbo/pro/text-to-video',
    image: '/fal-ai/kling-video/v2.5-turbo/pro/image-to-video',
  },
  'happy-horse-1-5': {
    text: '/fal-ai/kling-video/v2.5-turbo/pro/text-to-video',
    image: '/fal-ai/kling-video/v2.5-turbo/pro/image-to-video',
    reference: VIDU_REFERENCE_TO_VIDEO_ENDPOINT,
    referenceModel: 'viduq3-mix',
  },
  'happy-horse-1-0': {
    text: '/fal-ai/kling-video/v2.5-turbo/pro/text-to-video',
    image: '/fal-ai/kling-video/v2.5-turbo/pro/image-to-video',
    reference: VIDU_REFERENCE_TO_VIDEO_ENDPOINT,
    referenceModel: 'viduq2',
  },
  'ltx-2-3': {
    text: '/fal-ai/kling-video/v2.5-turbo/pro/text-to-video',
    image: '/fal-ai/kling-video/v2.5-turbo/pro/image-to-video',
  },
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getBaseUrl() {
  return (process.env.YUNWU_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '')
}

function normalizeModelSlug(model: string) {
  return model
    .trim()
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function dataUrlToBuffer(dataURL: string) {
  const match = dataURL.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) throw new Error('Reference image must be a public URL or a base64 data URL.')
  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], 'base64'),
  }
}

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

function getImageSize(aspectRatio = '1:1', resolution = '1k') {
  const longSide = resolution.toLowerCase() === '4k' ? 4096 : resolution.toLowerCase() === '2k' ? 2048 : 1280
  if (aspectRatio === '16:9') return { width: longSide, height: Math.round((longSide * 9) / 16) }
  if (aspectRatio === '9:16') return { width: Math.round((longSide * 9) / 16), height: longSide }
  if (aspectRatio === '3:4') return { width: Math.round((longSide * 3) / 4), height: longSide }
  if (aspectRatio === '4:3') return { width: longSide, height: Math.round((longSide * 3) / 4) }
  if (aspectRatio === '3:2') return { width: longSide, height: Math.round((longSide * 2) / 3) }
  if (aspectRatio === '2:3') return { width: Math.round((longSide * 2) / 3), height: longSide }
  return { width: longSide, height: longSide }
}

async function uploadReferenceImages(referenceImages: YunwuGenerateInput['referenceImages'] = []) {
  const urls: string[] = []

  for (const image of referenceImages) {
    if (!image.dataURL) continue
    if (isHttpUrl(image.dataURL)) {
      urls.push(image.dataURL)
      continue
    }

    const { buffer, mimeType } = dataUrlToBuffer(image.dataURL)
    const ext = mimeType.split('/')[1] || 'png'
    const prefix = process.env.OSS_KEY_PREFIX ? `${process.env.OSS_KEY_PREFIX}/` : ''
    const safeName = (image.name || `reference.${ext}`).replace(/[^a-zA-Z0-9._-]+/g, '-')
    const key = `${prefix}model-generations/references/${Date.now()}-${safeName}`
    const url = await uploadBufferToOSS(buffer, key, mimeType)
    if (!url) {
      throw new Error('Reference image upload failed. Configure OSS before using image/video reference generation.')
    }
    urls.push(url)
  }

  return urls
}

function buildImageRequest(input: YunwuGenerateInput, referenceUrls: string[]) {
  const modelConfig = IMAGE_MODEL_ENDPOINTS[normalizeModelSlug(input.model)]
  if (modelConfig?.endpoint.startsWith('/kling/')) {
    const prompt = input.style && input.style !== 'Auto' ? `${input.prompt}\nStyle template: ${input.style}` : input.prompt
    const isMultiReference = referenceUrls.length > 1 && modelConfig.multiReferenceEndpoint
    const endpoint = isMultiReference ? modelConfig.multiReferenceEndpoint! : modelConfig.endpoint
    const body: Record<string, unknown> = {
      model_name: isMultiReference ? modelConfig.multiReferenceModelName || modelConfig.modelName || 'kling-v2' : modelConfig.modelName || 'kling-v1',
      prompt,
      negative_prompt: '',
      resolution: input.resolution?.toLowerCase() || '1k',
      n: Math.min(Math.max(input.count || 1, 1), 4),
      aspect_ratio: input.aspectRatio || '1:1',
      callback_url: '',
    }

    if (isMultiReference) {
      body.subject_image_list = referenceUrls.map((url) => ({ subject_image: url }))
    } else if (referenceUrls.length) {
      body.image = referenceUrls[0]
      body.image_reference = referenceUrls[0]
      body.human_fidelity = 0.45
    }

    return { endpoint, body }
  }

  const prompt = input.style && input.style !== 'Auto' ? `${input.prompt}\nStyle template: ${input.style}` : input.prompt
  const body: Record<string, unknown> = {
    prompt,
    image_size: getImageSize(input.aspectRatio, input.resolution),
    num_images: Math.min(Math.max(input.count || 1, 1), 4),
    enable_safety_checker: true,
  }

  const endpoint = referenceUrls.length
    ? '/fal-ai/bytedance/seedream/v4/edit'
    : modelConfig?.endpoint || '/fal-ai/bytedance/seedream/v4/text-to-image'

  if (referenceUrls.length) body.image_urls = referenceUrls

  return { endpoint, body }
}

function buildVideoRequest(input: YunwuGenerateInput, referenceUrls: string[]) {
  const modelSlug = normalizeModelSlug(input.model)
  const endpoints = VIDEO_MODEL_ENDPOINTS[modelSlug] || VIDEO_MODEL_ENDPOINTS['seedance-2-0']
  const isReferenceMode = input.mode === 'Reference to Video' || referenceUrls.length > 1
  const endpoint = isReferenceMode ? endpoints.reference || VIDU_REFERENCE_TO_VIDEO_ENDPOINT : referenceUrls.length ? endpoints.image : endpoints.text
  const body: Record<string, unknown> = {
    prompt: input.prompt,
    aspect_ratio: input.aspectRatio || '16:9',
  }

  if (endpoint === KLING_TEXT_TO_VIDEO_ENDPOINT || endpoint === KLING_IMAGE_TO_VIDEO_ENDPOINT) {
    body.model_name = endpoints.modelName || 'kling-v1'
    body.negative_prompt = ''
    body.cfg_scale = 0.5
    body.mode = 'std'
    body.sound = 'off'
    body.callback_url = ''
    if (input.duration) body.duration = String(Math.min(Math.max(input.duration, 2), 15))
    if (referenceUrls.length) body.image = referenceUrls[0]
    return { endpoint, body }
  }

  if (endpoint === VIDU_REFERENCE_TO_VIDEO_ENDPOINT) {
    if (!referenceUrls.length) throw new Error('Vidu reference generation requires at least one reference image.')
    const subjectId = 'subject'
    body.model = endpoints.referenceModel || 'viduq2'
    body.subjects = [{ id: subjectId, images: referenceUrls }]
    body.prompt = input.prompt.includes(`@${subjectId}`) ? input.prompt : `@${subjectId} ${input.prompt}`
    body.style = 'general'
    if (input.duration) body.duration = Math.min(Math.max(input.duration, 2), 15)
    if (input.resolution) body.resolution = input.resolution.toLowerCase()
    return { endpoint, body }
  }

  if (referenceUrls.length) body.image_url = referenceUrls[0]
  if (input.duration) body.duration = `${Math.min(Math.max(input.duration, 2), 15)}s`
  if (input.resolution) body.resolution = input.resolution.toLowerCase()

  return { endpoint, body }
}

function extractMediaUrl(value: any): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string' && isHttpUrl(value)) return value

  const direct =
    value.url ||
    value.image_url ||
    value.video_url ||
    value.output_url ||
    value.result_url ||
    value.download_url ||
    value?.video?.url ||
    value?.image?.url ||
    value?.data?.url ||
    value?.data?.image_url ||
    value?.data?.video_url
  if (typeof direct === 'string' && isHttpUrl(direct)) return direct

  const arrays = [value.images, value.videos, value.output, value.data, value.result]
  for (const item of arrays) {
    if (!Array.isArray(item)) continue
    for (const nested of item) {
      const url = extractMediaUrl(nested)
      if (url) return url
    }
  }

  if (typeof value === 'object') {
    for (const nested of Object.values(value)) {
      const url = extractMediaUrl(nested)
      if (url) return url
    }
  }

  return undefined
}

function extractTaskId(value: any): string | undefined {
  if (!value || typeof value !== 'object') return undefined
  const direct = value.task_id || value.taskId || value.id || value.data?.task_id || value.data?.taskId || value.data?.id
  return direct ? String(direct) : undefined
}

function getKlingQueryEndpoint(endpoint: string, taskId: string) {
  if (endpoint === KLING_IMAGE_GENERATIONS_ENDPOINT) return `/kling/v1/images/generations/${taskId}`
  if (endpoint === KLING_MULTI_IMAGE_ENDPOINT) return `/kling/v1/images/multi-image2image/${taskId}`
  if (endpoint === KLING_TEXT_TO_VIDEO_ENDPOINT) return `/kling/v1/videos/text2video/${taskId}`
  if (endpoint === KLING_IMAGE_TO_VIDEO_ENDPOINT) return `/kling/v1/videos/image2video/${taskId}`
  return ''
}

function isKlingEndpoint(endpoint: string) {
  return Boolean(getKlingQueryEndpoint(endpoint, 'task-id'))
}

async function yunwuFetch(pathOrUrl: string, apiKey: string, init?: RequestInit) {
  const url = isHttpUrl(pathOrUrl) ? pathOrUrl : `${getBaseUrl()}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })
}

async function pollQueuedResult(initial: any, apiKey: string) {
  if (!initial?.status_url && !initial?.response_url) return initial
  let latest = initial

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    await sleep(POLL_INTERVAL_MS)
    const statusUrl = latest.status_url || initial.status_url
    if (statusUrl) {
      const statusRes = await yunwuFetch(statusUrl, apiKey, { method: 'GET' })
      if (statusRes.ok) {
        latest = await statusRes.json()
        const status = String(latest.status || '').toUpperCase()
        if (status && !['IN_QUEUE', 'IN_PROGRESS', 'PROCESSING', 'RUNNING'].includes(status)) break
      }
    }

    const responseUrl = latest.response_url || initial.response_url
    if (responseUrl) {
      const responseRes = await yunwuFetch(responseUrl, apiKey, { method: 'GET' })
      if (responseRes.ok) {
        const responseJson = await responseRes.json()
        const mediaUrl = extractMediaUrl(responseJson)
        if (mediaUrl) return responseJson
        latest = responseJson
      }
    }
  }

  return latest
}

async function pollViduTaskResult(initial: any, apiKey: string) {
  const taskId = extractTaskId(initial)
  if (!taskId) return initial

  let latest = initial
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const mediaUrl = extractMediaUrl(latest)
    if (mediaUrl) return latest

    const state = String(latest?.state || latest?.status || latest?.Response?.Status || '').toUpperCase()
    if (['FAILED', 'FAILURE', 'ERROR', 'CANCELED', 'CANCELLED'].includes(state)) {
      throw new Error(`Yunwu Vidu task failed: ${JSON.stringify(latest)}`)
    }

    await sleep(POLL_INTERVAL_MS)
    const response = await yunwuFetch(`/ent/v2/tasks/${taskId}/creations`, apiKey, { method: 'GET' })
    if (response.ok) {
      latest = await response.json()
    }
  }

  return latest
}

async function pollKlingTaskResult(initial: any, endpoint: string, apiKey: string) {
  const taskId = extractTaskId(initial)
  const queryEndpoint = taskId ? getKlingQueryEndpoint(endpoint, taskId) : ''
  if (!queryEndpoint) return initial

  let latest = initial
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const mediaUrl = extractMediaUrl(latest)
    if (mediaUrl) return latest

    const status = String(
      latest?.task_status ||
        latest?.status ||
        latest?.state ||
        latest?.data?.task_status ||
        latest?.data?.status ||
        latest?.data?.state ||
        ''
    ).toUpperCase()
    if (['FAILED', 'FAILURE', 'ERROR', 'CANCELED', 'CANCELLED'].includes(status)) {
      throw new Error(`Yunwu Kling task failed: ${JSON.stringify(latest)}`)
    }

    await sleep(POLL_INTERVAL_MS)
    const response = await yunwuFetch(queryEndpoint, apiKey, { method: 'GET' })
    if (response.ok) {
      latest = await response.json()
    }
  }

  return latest
}

export async function generateWithYunwu(input: YunwuGenerateInput): Promise<YunwuGenerationResult> {
  const apiKey = process.env.YUNWU_API_KEY
  if (!apiKey) throw new Error('YUNWU_API_KEY is not configured.')

  const referenceUrls = await uploadReferenceImages(input.referenceImages)
  const request = input.kind === 'image' ? buildImageRequest(input, referenceUrls) : buildVideoRequest(input, referenceUrls)

  const response = await yunwuFetch(request.endpoint, apiKey, {
    method: 'POST',
    body: JSON.stringify(request.body),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Yunwu request failed (${response.status}): ${message}`)
  }

  const queued = await response.json()
  const finalResult =
    request.endpoint === VIDU_REFERENCE_TO_VIDEO_ENDPOINT
      ? await pollViduTaskResult(queued, apiKey)
      : isKlingEndpoint(request.endpoint)
        ? await pollKlingTaskResult(queued, request.endpoint, apiKey)
      : await pollQueuedResult(queued, apiKey)
  const url = extractMediaUrl(finalResult)

  if (!url) {
    throw new Error('Yunwu did not return a media URL before the polling timeout.')
  }

  return {
    url,
    mediaType: input.kind,
    provider: 'yunwu',
    endpoint: request.endpoint,
    taskId: extractTaskId(queued),
    raw: finalResult,
  }
}
