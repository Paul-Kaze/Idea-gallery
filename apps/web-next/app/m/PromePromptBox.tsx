'use client'

import { ChangeEvent, KeyboardEvent, MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Check,
  ChevronDown,
  Clapperboard,
  Image as ImageIcon,
  RefreshCw,
  Send,
  Sparkles,
  Upload,
  Video,
  X,
} from 'lucide-react'
import { trackEvent } from '../../lib/analytics'
import type { GeneratorField } from './model-types'
import type { CSSProperties } from 'react'

type PromptBoxStyles = Record<string, string>

type UploadStatus = 'uploading' | 'ready' | 'error'
type ChatType = 'video' | 'image'
type ChatMenu = '' | 'creationType' | 'videoMode' | 'videoModel' | 'imageModel' | 'videoParams' | 'imageParams' | 'imageStyle'

type UploadItem = {
  id: string
  name: string
  type: string
  fileSize: number
  file?: File
  dataURL: string
  status: UploadStatus
  source: 'device' | 'asset'
}

type AssetPickerTab = 'upload' | 'history'

type AssetPickerItem = {
  id: string
  title: string
  url: string
  source: AssetPickerTab
  meta?: string
}

type GenerationResult = {
  url: string
  mediaType: ChatType
  endpoint?: string
  generatedAt?: string
}

type ModelItem = {
  slug: string
  name: string
  badge?: string
  description: string
  meta: string
  iconKey?: string
}

type ModelGroup = {
  key: string
  label: string
  models: ModelItem[]
}

type ImageStyleOption = {
  id: string
  name: string
  meta?: string
}

type PromePromptBoxProps = {
  styles: PromptBoxStyles
  promptId: string
  generatorHref: string
  displayName: string
  modelSlug: string
  analyticsLocation: string
  uploadAccept?: string
  assetsHref?: string
  category?: string
  fields?: GeneratorField[]
  generatorLinks?: Record<string, string>
}

const MAX_UPLOADS = 3
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const SUPPORT_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
const ASSET_TABS: Array<{ key: AssetPickerTab; label: string }> = [
  { key: 'upload', label: 'Uploaded' },
  { key: 'history', label: 'History' },
]

const VIDEO_MODE_OPTIONS = ['Text/Image to Video', 'Reference to Video', 'Frames to Video']
const CREATION_TYPE_OPTIONS: Array<{ key: ChatType; label: string }> = [
  { key: 'video', label: 'Video' },
  { key: 'image', label: 'Image' },
]
const VIDEO_DURATION_MIN = 2
const VIDEO_DURATION_MAX = 15
const VIDEO_RESOLUTION_OPTIONS = ['480p', '720p', '1080p']
const VIDEO_ASPECT_RATIO_OPTIONS = ['16:9', '9:16', '4:3', '3:4', '1:1']
const IMAGE_ASPECT_RATIO_OPTIONS = ['1:1', '16:9', '3:2', '2:3', '3:4', '4:3', '9:16']
const OUTPUT_NUMBER_OPTIONS = [1, 2, 3, 4]

const VIDEO_MODEL_GROUPS: ModelGroup[] = [
  {
    key: 'kling',
    label: 'Kling',
    models: [
      {
        slug: 'kling-video',
        name: 'Kling Video',
        badge: 'Official',
        description: 'Kling official text-to-video and image-to-video workflow.',
        meta: 'Video - official API',
        iconKey: 'kling',
      },
      {
        slug: 'kling-2-5-turbo-pro',
        name: 'Kling 2.5 Turbo Pro',
        badge: 'Pro',
        description: 'Kling 2.5 Turbo Pro via Yunwu Fal aggregation.',
        meta: 'Video - fast Pro',
        iconKey: 'kling',
      },
    ],
  },
  {
    key: 'seedance',
    label: 'Seedance',
    models: [
      {
        slug: 'seedance-3-0',
        name: 'Seedance 3.0',
        badge: 'New',
        description: 'Newest Seedance family model in PromeAI.',
        meta: '5-10 sec - 720p/1080p',
        iconKey: 'seedance',
      },
      {
        slug: 'seedance-2-0',
        name: 'Seedance 2.0',
        description: 'Cinematic image-to-video and text-to-video motion.',
        meta: '5-10 sec - 720p',
        iconKey: 'seedance',
      },
      {
        slug: 'seedance-2-0-fast',
        name: 'Seedance 2.0 Fast',
        badge: 'Fast',
        description: 'Lower-latency Seedance 2.0 generation.',
        meta: '5-10 sec - 720p',
        iconKey: 'seedance',
      },
      {
        slug: 'seedance-1-5-pro',
        name: 'Seedance 1.5 Pro',
        badge: 'Pro',
        description: 'Stable subject motion and camera control.',
        meta: '5-10 sec - 720p/1080p',
        iconKey: 'seedance',
      },
      {
        slug: 'seedance-1-0-pro',
        name: 'Seedance 1.0 Pro',
        description: 'Original Pro-tier Seedance workflow.',
        meta: '5-10 sec - 1080p',
        iconKey: 'seedance',
      },
      {
        slug: 'seedance-1-0-pro-fast',
        name: 'Seedance 1.0 Pro Fast',
        badge: 'Fast',
        description: 'Faster 1.0 Pro variant for quick drafts.',
        meta: '5-10 sec - 720p',
        iconKey: 'seedance',
      },
      {
        slug: 'seedance-1-0-lite',
        name: 'Seedance 1.0 Lite',
        badge: 'Lite',
        description: 'Lightweight Seedance generation for tests.',
        meta: '5 sec - 720p',
        iconKey: 'seedance',
      },
    ],
  },
  {
    key: 'happy-horse',
    label: 'Happy Horse',
    models: [
      {
        slug: 'happy-horse-1-5',
        name: 'Happy Horse 1.5',
        badge: 'Preview',
        description: 'Open-source audio-video model landing page in PromeAI.',
        meta: 'Up to 15 sec - 720p/1080p',
        iconKey: 'happyhorse',
      },
      {
        slug: 'happy-horse-1-0',
        name: 'Happy Horse 1.0',
        description: 'Alibaba Happy Horse model family page available in PromeAI.',
        meta: 'Video - audio capable',
        iconKey: 'happyhorse',
      },
    ],
  },
  {
    key: 'ltx',
    label: 'LTX',
    models: [
      {
        slug: 'ltx-2-3',
        name: 'LTX 2.3',
        description: 'Lightricks LTX video model page in PromeAI.',
        meta: 'Video - fast drafts',
        iconKey: 'ltx',
      },
    ],
  },
]

const IMAGE_MODEL_GROUPS: ModelGroup[] = [
  {
    key: 'kling',
    label: 'Kling',
    models: [
      {
        slug: 'kling-image',
        name: 'Kling Image',
        badge: 'Official',
        description: 'Kling official image generation workflow.',
        meta: 'Image - official API',
        iconKey: 'kling',
      },
      {
        slug: 'kling-v2-reference-image',
        name: 'Kling V2 Reference Image',
        description: 'Kling multi-reference image generation for subject fusion.',
        meta: 'Image - reference',
        iconKey: 'kling',
      },
    ],
  },
  {
    key: 'seedream',
    label: 'Seedream',
    models: [
      {
        slug: 'seedream-5-0',
        name: 'Seedream 5.0',
        badge: 'New',
        description: 'Seedream 5.0 image generation through iShencai.',
        meta: 'Image - iShencai',
        iconKey: 'seedream',
      },
      {
        slug: 'seedream-4-5',
        name: 'Seedream 4.5',
        badge: 'New',
        description: 'Newest Seedream image model available in PromeAI.',
        meta: 'Image - high fidelity',
        iconKey: 'seedream',
      },
      {
        slug: 'seedream-4-0',
        name: 'Seedream 4.0',
        description: 'Seedream image generation model in PromeAI.',
        meta: 'Image - reliable',
        iconKey: 'seedream',
      },
    ],
  },
  {
    key: 'nano-banana',
    label: 'Nano Banana',
    models: [
      {
        slug: 'nano-banana-pro',
        name: 'Nano Banana Pro',
        badge: 'Pro',
        description: 'Nano Banana Pro image model available in PromeAI.',
        meta: 'Image - advanced',
        iconKey: 'nano',
      },
      {
        slug: 'nano-banana-2',
        name: 'Nano Banana 2',
        badge: 'New',
        description: 'Nano Banana 2 image model page in PromeAI.',
        meta: 'Image - fast',
        iconKey: 'nano',
      },
      {
        slug: 'nano-banana',
        name: 'Nano Banana',
        description: 'Nano Banana image generation model.',
        meta: 'Image - standard',
        iconKey: 'nano',
      },
    ],
  },
  {
    key: 'openai',
    label: 'OpenAI',
    models: [
      {
        slug: 'gpt-image-2',
        name: 'GPT Image 2',
        description: 'OpenAI image model page available in PromeAI.',
        meta: 'Image - general purpose',
        iconKey: 'gpt',
      },
    ],
  },
]

const IMAGE_STYLE_OPTIONS: ImageStyleOption[] = [
  'Auto',
  'Ghibli',
  'Ultra Realism',
  'Ultra Realism V2',
  'Pixel Art',
  'Japanese Anime',
  '3D Render',
  'Steampunk',
  'Cyberpunk',
  'CG Animation',
  'Anime Figure',
  'Pixar',
  'Natural Landscape',
  'Film Noir',
  'Studio Photography',
  'Animation',
  'Comic',
  'Modern Photography',
  'Soviet Retro',
  'Caricature',
  'Futurism',
  'Logos & Brands',
  'Children Illustration',
  'Sci-Fi Illustration',
  'Urban Noir',
  'Colored Pen Drawing',
  'Illustration',
  'Cute Cartoon',
  'Stylized Animation',
  'Mystic Dark',
  'Indian Miniature',
  'Northern Renaissance',
  'Medieval Art',
  'Graffiti',
  'Black and White',
  'Acrylic Painting',
  'Synthwave',
  'Pencil Sketch',
  'High Renaissance',
  'Acid Art',
  'Snow Globe',
  'Ukiyo-e',
  'Chinese Ink Painting',
  'Icy Elegance',
  'Liquid Metal',
  'Pop Line Art',
  'Mughal Art',
  'Cloud Pattern',
  'Flower Pattern',
  'Constructivism',
  'Graphic Icons',
  'Isometric',
  'Ice Sculpture',
  'Surrealism',
  'Cartoon Cookie',
  'Psychedelic',
  'Chocolate Art',
  'Crystal Glass',
  'Thick Impasto',
  'Illustration V2',
  'Hand Drawn',
  'Grainy Art',
  'Kids Drawing',
  '2D Art Poster',
  'Handmade 3D',
  'Hand Drawn Outline',
  'Graphic Art',
  '2D Art Poster V2',
  'Black and White V2',
  'Hard Flash',
  'HDR',
  'Natural Light',
  'Studio Portrait',
  'Warm Tone',
  'Motion Blur',
  'Monet',
  'Picasso',
  'Matisse',
  'Baroque',
  'Colored Pencil Drawing',
  'Fluorescent Painting',
].map((name) => ({ id: name, name }))

const VIDEO_MODEL_BILLING: Record<string, { modelCoin?: number; strategy: string; hasAudio?: boolean }> = {
  'Kling Video': { modelCoin: 20, strategy: 'kling' },
  'Kling 2.5 Turbo Pro': { modelCoin: 20, strategy: 'kling' },
  'Seedance 3.0': { modelCoin: 20, strategy: 'seedanceV2' },
  'Seedance 2.0': { modelCoin: 20, strategy: 'seedanceV2' },
  'Seedance 2.0 Fast': { modelCoin: 16, strategy: 'seedanceV2' },
  'Seedance 1.5 Pro': { modelCoin: 10, strategy: 'legacySeedance', hasAudio: true },
  'Seedance 1.0 Pro': { modelCoin: 20, strategy: 'legacySeedance' },
  'Seedance 1.0 Pro Fast': { modelCoin: 15, strategy: 'legacySeedance' },
  'Seedance 1.0 Lite': { modelCoin: 15, strategy: 'legacySeedance' },
  'LTX 2.3': { modelCoin: 15, strategy: 'ltx' },
  'Ltx 2.3': { modelCoin: 15, strategy: 'ltx' },
  'Happy Horse 1.5': { strategy: 'happyHorse' },
  'Happy Horse 1.0': { strategy: 'happyHorse' },
}

const IMAGE_MODEL_BILLING: Record<string, { resolution: string; quality?: string }> = {
  'Kling Image': { resolution: '1k' },
  'Kling V2 Reference Image': { resolution: '1k' },
  'GPT Image 2': { resolution: '4k', quality: 'low' },
  'Seedream 5.0': { resolution: '2k' },
  'Nano Banana 2': { resolution: '1k' },
  'Nano Banana Pro': { resolution: '2k' },
  'Nano Banana': { resolution: '1k' },
  'Seedream 4.5': { resolution: '4k' },
  'Seedream 4.0': { resolution: '4k' },
  'Qwen-Image': { resolution: '1k' },
}

const MODEL_ICON_SRC_BY_KEY: Record<string, string> = {
  kling: '/m/model-icons/model-ltx.png',
  seedance: '/m/model-icons/model-seedream.png',
  seedream: '/m/model-icons/model-seedream.png',
  happyhorse: '/m/model-icons/model-happyhorse.png',
  ltx: '/m/model-icons/model-ltx.png',
  nano: '/m/model-icons/model-nano-banana.png',
  gpt: '/m/model-icons/model-gpt.png',
}

function createUploadId(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`
}

function slugifyModelName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getField(fields: GeneratorField[] | undefined, name: string) {
  return fields?.find((field) => field.name === name)
}

function getFieldDefault(fields: GeneratorField[] | undefined, name: string, fallback: string) {
  const field = getField(fields, name)
  return field?.default || field?.options?.[0] || fallback
}

function normalizeDurationSeconds(value: string | number, fallback = 5) {
  const parsed = Number(String(value).replace(/[^0-9.]/g, ''))
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(Math.max(Math.round(parsed), VIDEO_DURATION_MIN), VIDEO_DURATION_MAX)
}

function normalizePositiveNumber(value: string | number, fallback: number) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : fallback
}

function formatCredits(value: number) {
  if (!Number.isFinite(value) || value <= 0) return '0'
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)
}

function getResolutionSurchargeCoin(resolution: string, officialMaxResolution: string) {
  if (officialMaxResolution === '720p' && resolution === '1080p') return 1
  if (resolution === '2k') return 2
  if (resolution === '4k') return 3
  return 0
}

function getSeedanceV2ResolutionCoin(modelCoin: number, resolution: string, duration: number) {
  let perSecondCoin = modelCoin
  if (resolution === '720p') {
    perSecondCoin = modelCoin * 2
  } else if (['1080p', '2k', '4k'].includes(resolution)) {
    perSecondCoin = modelCoin * 2 + getResolutionSurchargeCoin(resolution, '720p')
  }
  return perSecondCoin * duration
}

function getLegacySeedanceResolutionCoin(modelCoin: number, resolution: string, duration: number, hasAudio = false) {
  let perSecondCoin = modelCoin / 5
  if (resolution === '720p') {
    perSecondCoin = (modelCoin * 2) / 5
  } else if (['1080p', '2k', '4k'].includes(resolution)) {
    perSecondCoin = modelCoin
  }
  if (hasAudio) perSecondCoin *= 2
  perSecondCoin += getResolutionSurchargeCoin(resolution, '1080p')
  return perSecondCoin * duration
}

function getLtxResolutionCoin(modelCoin: number, resolution: string, duration: number) {
  let perSecondCoin = modelCoin / 5
  if (['720p', '1080p', '2k', '4k'].includes(resolution)) {
    perSecondCoin = (modelCoin * 2) / 5
  }
  perSecondCoin += getResolutionSurchargeCoin(resolution, '720p')
  return perSecondCoin * duration
}

function getHappyHorseResolutionCoin(resolution: string, duration: number) {
  const perSecondCoinMap: Record<string, number> = {
    '720p': 20,
    '1080p': 35,
    '2k': 37,
    '4k': 38,
  }
  return (perSecondCoinMap[resolution] || perSecondCoinMap['720p']) * duration
}

function getGptImage2Coin(resolution: string, quality: string) {
  let resolutionRatio = 1
  let qualityRatio = 1
  if (resolution === '4k') resolutionRatio = 4
  else if (resolution === '2k') resolutionRatio = 2
  if (quality === 'high') qualityRatio = 28
  else if (quality === 'medium') qualityRatio = 8
  return resolutionRatio * qualityRatio
}

function getImageModelCoin(version: string, resolution = '1k', quality = 'low') {
  if (version === 'GPT Image 2') return getGptImage2Coin(resolution, quality)
  if (version === 'Seedream 5.0') return 8
  if (version === 'Seedream 4.0') return 5
  if (version === 'Seedream 4.5') return 6
  if (version === 'Nano Banana') return 6
  if (version === 'Nano Banana 2') {
    if (resolution === '4k') return 15
    if (resolution === '2k') return 10
    if (resolution === '512') return 4
    return 6
  }
  if (version === 'Nano Banana Pro') return resolution === '4k' ? 20 : 10
  if (version.toLowerCase() === 'v3') return 0.6
  if (version === 'Qwen-Image') return 0.6
  return 0.1
}

function getKnownModelNames(groups: ModelGroup[]) {
  return new Set(groups.flatMap((group) => group.models.map((model) => model.name)))
}

function extendModelGroups(baseGroups: ModelGroup[], fieldNames: string[], displayName: string, type: ChatType) {
  const knownNames = getKnownModelNames(baseGroups)
  const extraNames = Array.from(new Set([displayName, ...fieldNames].filter(Boolean))).filter((name) => !knownNames.has(name))

  if (!extraNames.length) return baseGroups

  const extraModels = extraNames.map<ModelItem>((name) => ({
    slug: slugifyModelName(name),
    name,
    description: `${name} from this Dommi landing page.`,
    meta: type === 'video' ? 'Video model' : 'Image model',
    iconKey: type === 'video' ? 'seedance' : 'seedream',
  }))

  return [
    {
      key: 'current',
      label: 'Current page',
      models: extraModels,
    },
    ...baseGroups,
  ]
}

function findModelGroupKey(groups: ModelGroup[], modelName: string, fallback: string) {
  return groups.find((group) => group.models.some((model) => model.name === modelName))?.key || fallback
}

function findModelItem(groups: ModelGroup[], modelName: string) {
  for (const group of groups) {
    const match = group.models.find((model) => model.name === modelName)
    if (match) return match
  }
  return undefined
}

function normalizeLink(href: string) {
  return href || '/tools'
}

function setUrlParams(href: string, params: Record<string, string | number | undefined>) {
  const url = new URL(normalizeLink(href), 'https://dommi.local')
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue
    url.searchParams.set(key, String(value))
  }
  return `${url.pathname}${url.search}${url.hash}`
}

function getStyleSwatch(styleName: string): CSSProperties {
  const index = IMAGE_STYLE_OPTIONS.findIndex((style) => style.name === styleName)
  const hue = index < 0 ? 320 : (index * 37) % 360
  const hueTwo = (hue + 42) % 360
  const hueThree = (hue + 188) % 360
  return {
    background: `linear-gradient(135deg, hsl(${hue}, 78%, 60%), hsl(${hueTwo}, 84%, 56%) 52%, hsl(${hueThree}, 78%, 46%))`,
  }
}

function getModelMarkClass(styles: PromptBoxStyles, iconKey: string | undefined) {
  if (iconKey === 'kling') return styles.chatboxModelMarkKling || styles.chatboxModelMarkLtx
  if (iconKey === 'happyhorse') return styles.chatboxModelMarkHappyHorse
  if (iconKey === 'ltx') return styles.chatboxModelMarkLtx
  if (iconKey === 'nano') return styles.chatboxModelMarkNano
  if (iconKey === 'gpt') return styles.chatboxModelMarkGpt
  if (iconKey === 'seedream') return styles.chatboxModelMarkSeedream
  return styles.chatboxModelMarkSeedance
}

function getModelIconSrc(iconKey: string | undefined) {
  if (!iconKey) return ''
  return MODEL_ICON_SRC_BY_KEY[iconKey] || ''
}

export default function PromePromptBox({
  styles,
  promptId,
  generatorHref,
  displayName,
  modelSlug,
  analyticsLocation,
  uploadAccept = 'image/jpeg,image/jpg,image/png,image/webp',
  assetsHref = '/assets',
  category = 'video',
  fields,
  generatorLinks,
}: PromePromptBoxProps) {
  const modelField = getField(fields, 'model')
  const modelFieldOptions = modelField?.options || []
  const defaultModel = modelField?.default || displayName
  const initialChatType: ChatType = category === 'image' ? 'image' : 'video'
  const defaultVideoModel = getKnownModelNames(VIDEO_MODEL_GROUPS).has(defaultModel) ? defaultModel : 'Seedance 2.0'
  const defaultImageModel = getKnownModelNames(IMAGE_MODEL_GROUPS).has(defaultModel) ? defaultModel : 'Seedream 4.5'
  const initialVideoModel = category === 'video' ? defaultModel : defaultVideoModel
  const initialImageModel = category === 'image' ? defaultModel : defaultImageModel
  const initialVideoAspectRatio = category === 'video' ? getFieldDefault(fields, 'aspectRatio', '16:9') : '16:9'
  const initialVideoDuration = category === 'video' ? getFieldDefault(fields, 'duration', '5s') : '5s'
  const initialVideoResolution = category === 'video' ? getFieldDefault(fields, 'resolution', '720p') : '720p'
  const initialImageAspectRatio = category === 'image' ? getFieldDefault(fields, 'aspectRatio', '1:1') : '1:1'

  const [message, setMessage] = useState('')
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('')
  const [assetPickerOpen, setAssetPickerOpen] = useState(false)
  const [assetTab, setAssetTab] = useState<AssetPickerTab>('upload')
  const [assetItems, setAssetItems] = useState<AssetPickerItem[]>([])
  const [assetLoading, setAssetLoading] = useState(false)
  const [assetError, setAssetError] = useState('')
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([])
  const [activeChatType, setActiveChatType] = useState<ChatType>(initialChatType)
  const [activeChatMenu, setActiveChatMenu] = useState<ChatMenu>('')
  const [activeVideoModelCategory, setActiveVideoModelCategory] = useState('seedance')
  const [activeImageModelCategory, setActiveImageModelCategory] = useState('seedream')
  const [videoMode, setVideoMode] = useState(VIDEO_MODE_OPTIONS[0])
  const [videoModel, setVideoModel] = useState(initialVideoModel)
  const [imageModel, setImageModel] = useState(initialImageModel)
  const [videoAspectRatio, setVideoAspectRatio] = useState(initialVideoAspectRatio)
  const [videoDuration, setVideoDuration] = useState(normalizeDurationSeconds(initialVideoDuration))
  const [videoResolution, setVideoResolution] = useState(initialVideoResolution.toLowerCase())
  const [imageAspectRatio, setImageAspectRatio] = useState(initialImageAspectRatio)
  const [imageOutputCount, setImageOutputCount] = useState(1)
  const [imageStyle, setImageStyle] = useState('Auto')
  const [styleSearch, setStyleSearch] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState('')
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const chatboxRef = useRef<HTMLDivElement>(null)

  const videoModelGroups = useMemo(
    () => extendModelGroups(VIDEO_MODEL_GROUPS, category === 'video' ? modelFieldOptions : [], category === 'video' ? defaultModel : '', 'video'),
    [category, defaultModel, modelFieldOptions]
  )
  const imageModelGroups = useMemo(
    () => extendModelGroups(IMAGE_MODEL_GROUPS, category === 'image' ? modelFieldOptions : [], category === 'image' ? defaultModel : '', 'image'),
    [category, defaultModel, modelFieldOptions]
  )

  const activeModelGroups = activeChatType === 'video' ? videoModelGroups : imageModelGroups
  const activeModelCategory = activeChatType === 'video' ? activeVideoModelCategory : activeImageModelCategory
  const activeModelOptions =
    activeModelGroups.find((group) => group.key === activeModelCategory)?.models || activeModelGroups[0]?.models || []
  const modelChipLabel = activeChatType === 'video' ? videoModel : imageModel
  const activeModelItem = findModelItem(activeModelGroups, modelChipLabel) || activeModelOptions[0]
  const aspectRatioLabel = activeChatType === 'video' ? videoAspectRatio : imageAspectRatio
  const durationLabel = `${videoDuration}s`
  const resolutionLabel = videoResolution || '720p'
  const hasReadyUpload = uploads.some((item) => item.status === 'ready')
  const isUploading = uploads.some((item) => item.status === 'uploading')
  const canSubmit = (Boolean(message.trim()) || hasReadyUpload) && !isUploading
  const uploadLimitReached = uploads.length >= MAX_UPLOADS
  const remainingAssetSlots = Math.max(0, MAX_UPLOADS - uploads.length)
  const sendTooltip = isUploading
    ? 'Picture uploading in progress'
    : isGenerating
      ? 'Generation in progress'
    : canSubmit
      ? 'Generate'
      : 'Please enter the content or upload an image'
  const promptPlaceholder =
    activeChatType === 'image'
      ? 'Enter your idea to generate'
      : 'What do you want to create today? Describe the full video idea.'
  const videoDurationProgress =
    ((Math.min(Math.max(videoDuration, VIDEO_DURATION_MIN), VIDEO_DURATION_MAX) - VIDEO_DURATION_MIN) /
      (VIDEO_DURATION_MAX - VIDEO_DURATION_MIN)) *
    100
  const generateCredits =
    activeChatType === 'video'
      ? getVideoGenerateCredits(videoModel, videoResolution, videoDuration)
      : getImageGenerateCredits(imageModel, imageOutputCount)
  const filteredImageStyles = IMAGE_STYLE_OPTIONS.filter((style) =>
    style.name.toLowerCase().includes(styleSearch.trim().toLowerCase())
  )
  const activeGeneratorHref = buildActiveGeneratorHref()

  useEffect(() => {
    const videoKey = findModelGroupKey(videoModelGroups, videoModel, 'seedance')
    const imageKey = findModelGroupKey(imageModelGroups, imageModel, 'seedream')
    setActiveVideoModelCategory(videoKey)
    setActiveImageModelCategory(imageKey)
  }, [imageModel, imageModelGroups, videoModel, videoModelGroups])

  useEffect(() => {
    function closeMenu(event: globalThis.MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', closeMenu)
    return () => document.removeEventListener('mousedown', closeMenu)
  }, [])

  useEffect(() => {
    function closeOptionMenu(event: globalThis.MouseEvent) {
      if (chatboxRef.current && !chatboxRef.current.contains(event.target as Node)) {
        setActiveChatMenu('')
      }
    }

    document.addEventListener('mousedown', closeOptionMenu)
    return () => document.removeEventListener('mousedown', closeOptionMenu)
  }, [])

  useEffect(() => {
    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (assetPickerOpen) {
        closeAssetPicker()
        return
      }
      setActiveChatMenu('')
      setMenuOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [assetPickerOpen])

  useEffect(() => {
    if (!assetPickerOpen) return

    let cancelled = false

    async function loadAssets() {
      setAssetLoading(true)
      setAssetError('')
      setAssetItems([])

      try {
        if (assetTab === 'upload') {
          const response = await fetch('/api/images?page=1&size=40', { cache: 'no-store' })
          const data = await response.json()
          if (cancelled) return
          const items = (data.items || [])
            .filter((item: any) => item.type === 'image' && item.thumbnailUrl)
            .map((item: any) => ({
              id: `upload-${item.id}`,
              title: item.model || 'Uploaded asset',
              url: item.thumbnailUrl,
              source: 'upload' as const,
              meta: item.model,
            }))
          setAssetItems(items)
          return
        }

        if (assetTab === 'history') {
          const response = await fetch('/api/tools/baby-generate/history', { cache: 'no-store' })
          const data = await response.json()
          if (cancelled) return
          const items = (data.history || [])
            .filter((item: any) => item.imageUrl)
            .map((item: any) => ({
              id: `history-${item.id}`,
              title: 'History image',
              url: item.imageUrl,
              source: 'history' as const,
              meta: item.generatedAt,
            }))
          setAssetItems(items)
          return
        }

        setAssetItems([])
      } catch {
        if (!cancelled) setAssetError('Unable to load assets')
      } finally {
        if (!cancelled) setAssetLoading(false)
      }
    }

    loadAssets()
    return () => {
      cancelled = true
    }
  }, [assetPickerOpen, assetTab])

  useEffect(() => {
    if (message.length > 0) {
      setAnimatedPlaceholder(promptPlaceholder)
      return
    }

    let current = ''
    let mode: 'typing' | 'erasing' = 'typing'
    let timer: ReturnType<typeof setTimeout>

    function tick() {
      if (mode === 'typing') {
        current = promptPlaceholder.slice(0, current.length + 1)
        setAnimatedPlaceholder(current)
        if (current.length === promptPlaceholder.length) {
          mode = 'erasing'
          timer = setTimeout(tick, 1500)
          return
        }
        timer = setTimeout(tick, 52)
        return
      }

      current = current.slice(0, -1)
      setAnimatedPlaceholder(current)
      if (current.length === 0) {
        mode = 'typing'
        timer = setTimeout(tick, 500)
        return
      }
      timer = setTimeout(tick, 28)
    }

    tick()
    return () => clearTimeout(timer)
  }, [message, promptPlaceholder])

  function getVideoGenerateCredits(modelName: string, resolution: string, duration: number) {
    const billing = VIDEO_MODEL_BILLING[modelName]
    if (!billing) return formatCredits(10)
    const normalizedDuration = normalizePositiveNumber(duration, 5)
    const normalizedResolution = resolution.toLowerCase()
    let perGenerationCoin = billing.modelCoin || 0
    if (billing.strategy === 'seedanceV2' && billing.modelCoin) {
      perGenerationCoin = getSeedanceV2ResolutionCoin(billing.modelCoin, normalizedResolution, normalizedDuration)
    } else if (billing.strategy === 'legacySeedance' && billing.modelCoin) {
      perGenerationCoin = getLegacySeedanceResolutionCoin(
        billing.modelCoin,
        normalizedResolution,
        normalizedDuration,
        billing.hasAudio
      )
    } else if (billing.strategy === 'ltx' && billing.modelCoin) {
      perGenerationCoin = getLtxResolutionCoin(billing.modelCoin, normalizedResolution, normalizedDuration)
    } else if (billing.strategy === 'happyHorse') {
      perGenerationCoin = getHappyHorseResolutionCoin(normalizedResolution, normalizedDuration)
    }
    return formatCredits(perGenerationCoin)
  }

  function getImageGenerateCredits(modelName: string, outputCount: number) {
    const defaults = IMAGE_MODEL_BILLING[modelName] || { resolution: '1k', quality: 'low' }
    const perGenerationCoin = getImageModelCoin(modelName, defaults.resolution, defaults.quality || 'low')
    return formatCredits(perGenerationCoin * outputCount)
  }

  function buildActiveGeneratorHref() {
    const selectedModel = activeChatType === 'video' ? videoModel : imageModel
    const selectedModelSlug = findModelItem(activeModelGroups, selectedModel)?.slug || slugifyModelName(selectedModel)
    const fallbackImageHref = activeChatType === 'image' ? '/ai-image-generation' : '/image-to-video'
    const fallbackTextHref = activeChatType === 'image' ? '/ai-image-generation' : '/text-to-video'
    const baseHref =
      activeChatType === 'image'
        ? generatorLinks?.image && category === 'image'
          ? generatorLinks.image
          : fallbackImageHref
        : videoMode === 'Reference to Video' || videoMode === 'Frames to Video' || uploads.length
          ? generatorLinks?.image || fallbackImageHref
          : generatorLinks?.text || generatorHref || fallbackTextHref

    return setUrlParams(baseHref, {
      model: selectedModelSlug,
      type: activeChatType,
      mode: activeChatType === 'video' ? videoMode : undefined,
      aspectRatio: aspectRatioLabel,
      duration: activeChatType === 'video' ? durationLabel : undefined,
      resolution: activeChatType === 'video' ? resolutionLabel : undefined,
      count: activeChatType === 'image' ? imageOutputCount : undefined,
      style: activeChatType === 'image' && imageStyle !== 'Auto' ? imageStyle : undefined,
    })
  }

  function setTemporaryNotice(value: string) {
    setNotice(value)
    window.setTimeout(() => setNotice(''), 2600)
  }

  function toggleChatMenu(menu: ChatMenu) {
    setActiveChatMenu((current) => (current === menu ? '' : menu))
    setMenuOpen(false)
  }

  function selectChatType(type: ChatType) {
    setActiveChatType(type)
    setActiveChatMenu('')
    setMenuOpen(false)
    trackEvent('generator_type_changed', {
      tool_name: 'model_landing_generator',
      model_slug: modelSlug,
      type,
    })
  }

  function selectVideoMode(mode: string) {
    setVideoMode(mode)
    setActiveChatMenu('')
  }

  function selectModel(model: ModelItem) {
    if (activeChatType === 'video') {
      setVideoModel(model.name)
    } else {
      setImageModel(model.name)
    }
    setActiveChatMenu('')
  }

  function readUpload(item: UploadItem) {
    if (!item.file) return

    const reader = new FileReader()
    reader.onload = (readerEvent) => {
      setUploads((current) =>
        current.map((upload) =>
          upload.id === item.id
            ? {
                ...upload,
                dataURL: String(readerEvent.target?.result || ''),
                status: 'ready',
              }
            : upload
        )
      )
      trackEvent('upload_completed', {
        tool_name: 'model_landing_generator',
        model_slug: modelSlug,
        file_type: item.type,
        file_size_kb: Math.round(item.fileSize / 1024),
      })
    }
    reader.onerror = () => {
      setUploads((current) =>
        current.map((upload) => (upload.id === item.id ? { ...upload, status: 'error' } : upload))
      )
    }
    reader.readAsDataURL(item.file)
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return

    const remainingSlots = MAX_UPLOADS - uploads.length
    if (remainingSlots <= 0) {
      setTemporaryNotice('Upload up to 3 images')
      return
    }

    const files = Array.from(fileList)
    const supportedFiles = files.filter((file) => SUPPORT_TYPES.has(file.type)).slice(0, remainingSlots)

    if (supportedFiles.length !== files.length) {
      setTemporaryNotice('Contains unsupported file types.')
    }

    if (files.length > remainingSlots) {
      setTemporaryNotice('Upload up to 3 images')
    }

    const currentUploadSize = uploads.reduce((total, item) => total + item.fileSize, 0)
    const nextUploadSize = supportedFiles.reduce((total, file) => total + file.size, 0)
    if (currentUploadSize + nextUploadSize > MAX_UPLOAD_BYTES) {
      setTemporaryNotice('The total size of the files exceeds 10MB, and the upload has failed.')
      return
    }

    const nextUploads = supportedFiles.map<UploadItem>((file) => ({
      id: createUploadId(file),
      name: file.name,
      type: file.type,
      fileSize: file.size,
      file,
      dataURL: '',
      status: 'uploading',
      source: 'device',
    }))

    if (!nextUploads.length) return

    setUploads((current) => [...current, ...nextUploads])
    nextUploads.forEach(readUpload)
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles(event.target.files)
    event.target.value = ''
  }

  function handleUploadClick() {
    if (uploadLimitReached) {
      setTemporaryNotice('Upload up to 3 images')
      return
    }
    setMenuOpen(false)
    setActiveChatMenu('')
    fileInputRef.current?.click()
  }

  function removeUpload(id: string) {
    setUploads((current) => current.filter((item) => item.id !== id))
  }

  function retryUpload(item: UploadItem) {
    if (!item.file) return

    setUploads((current) =>
      current.map((upload) => (upload.id === item.id ? { ...upload, status: 'uploading' } : upload))
    )
    readUpload(item)
  }

  function openAssetPicker() {
    if (uploadLimitReached) {
      setTemporaryNotice('Upload up to 3 images')
      return
    }

    setMenuOpen(false)
    setActiveChatMenu('')
    setAssetTab('upload')
    setSelectedAssetIds([])
    setAssetPickerOpen(true)
  }

  function closeAssetPicker() {
    setAssetPickerOpen(false)
    setSelectedAssetIds([])
  }

  function changeAssetTab(tab: AssetPickerTab) {
    setAssetTab(tab)
    setSelectedAssetIds([])
  }

  function toggleAssetSelection(item: AssetPickerItem) {
    if (selectedAssetIds.includes(item.id)) {
      setSelectedAssetIds((current) => current.filter((id) => id !== item.id))
      return
    }

    if (selectedAssetIds.length >= remainingAssetSlots) {
      setTemporaryNotice('Upload up to 3 images')
      return
    }

    setSelectedAssetIds((current) => [...current, item.id])
  }

  function confirmAssetSelection() {
    if (!selectedAssetIds.length) return

    const selectedItems = assetItems.filter((item) => selectedAssetIds.includes(item.id)).slice(0, remainingAssetSlots)
    if (!selectedItems.length) {
      setTemporaryNotice('Upload up to 3 images')
      return
    }

    const nextUploads = selectedItems.map<UploadItem>((item) => ({
      id: `${item.id}-${Math.random().toString(36).slice(2)}`,
      name: item.title,
      type: 'image/asset',
      fileSize: 0,
      dataURL: item.url,
      status: 'ready',
      source: 'asset',
    }))

    setUploads((current) => [...current, ...nextUploads])
    nextUploads.forEach((item) => {
      trackEvent('upload_completed', {
        tool_name: 'model_landing_generator',
        model_slug: modelSlug,
        file_type: item.type,
        file_size_kb: 0,
      })
    })
    closeAssetPicker()
  }

  function handleAssetUploadClick() {
    closeAssetPicker()
    handleUploadClick()
  }

  function getGenerateAnalyticsPayload() {
    return {
      tool_name: 'model_landing_generator',
      model_slug: modelSlug,
      prompt_length: message.trim().length,
      upload_count: uploads.filter((item) => item.status === 'ready').length,
      creation_type: activeChatType,
      selected_model: modelChipLabel,
      mode: activeChatType === 'video' ? videoMode : 'Text/Image to Image',
      aspect_ratio: aspectRatioLabel,
      duration: activeChatType === 'video' ? durationLabel : undefined,
      resolution: activeChatType === 'video' ? resolutionLabel : undefined,
      output_count: activeChatType === 'image' ? imageOutputCount : undefined,
      style: activeChatType === 'image' ? imageStyle : undefined,
      href: activeGeneratorHref,
    }
  }

  function trackGenerate() {
    trackEvent('cta_clicked', {
      location: analyticsLocation,
      label: `Generate with ${displayName}`,
      ...getGenerateAnalyticsPayload(),
    })
  }

  async function submitGeneration() {
    if (!canSubmit || isGenerating) {
      setTemporaryNotice(sendTooltip)
      return
    }

    setIsGenerating(true)
    setGenerationError('')
    setGenerationResult(null)
    trackGenerate()

    try {
      const response = await fetch('/api/tools/model-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: message.trim(),
          type: activeChatType,
          model: modelChipLabel,
          mode: activeChatType === 'video' ? videoMode : 'Text/Image to Image',
          aspectRatio: aspectRatioLabel,
          duration: activeChatType === 'video' ? videoDuration : undefined,
          resolution: activeChatType === 'video' ? resolutionLabel : undefined,
          count: activeChatType === 'image' ? imageOutputCount : undefined,
          style: activeChatType === 'image' ? imageStyle : undefined,
          creditsCost: Number(generateCredits),
          uploads: uploads
            .filter((item) => item.status === 'ready')
            .map((item) => ({
              name: item.name,
              type: item.type,
              dataURL: item.dataURL,
            })),
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Generation failed.')
      }

      setGenerationResult({
        url: data.url,
        mediaType: data.mediaType || activeChatType,
        endpoint: data.endpoint,
        generatedAt: data.generatedAt,
      })
      setTemporaryNotice('Generation complete')
      trackEvent('generation_succeeded_client', {
        ...getGenerateAnalyticsPayload(),
        endpoint: data.endpoint,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Generation failed.'
      setGenerationError(errorMessage)
      setTemporaryNotice(errorMessage)
      trackEvent('generation_failed_client', {
        ...getGenerateAnalyticsPayload(),
        reason: errorMessage,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  function handleSubmit(event?: MouseEvent<HTMLButtonElement>) {
    event?.preventDefault()
    if (!canSubmit) {
      setTemporaryNotice(sendTooltip)
      return
    }

    submitGeneration()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter' || event.shiftKey) return

    event.preventDefault()
    if (!canSubmit) {
      setTemporaryNotice(sendTooltip)
      return
    }

    submitGeneration()
  }

  function renderModelMark(model: ModelItem | undefined, size: 'chip' | 'option' = 'chip') {
    const iconSrc = getModelIconSrc(model?.iconKey)
    if (iconSrc) {
      return (
        <img
          className={`${styles.chatboxModelMark} ${size === 'option' ? styles.chatboxModelMarkOption : ''}`}
          src={iconSrc}
          alt=""
        />
      )
    }

    return (
      <span
        className={`${styles.chatboxModelMark} ${getModelMarkClass(styles, model?.iconKey)} ${
          size === 'option' ? styles.chatboxModelMarkOption : ''
        }`}
        aria-hidden="true"
      >
        {model?.name?.slice(0, 1) || 'M'}
      </span>
    )
  }

  function renderPopover() {
    if (!activeChatMenu) return null

    if (activeChatMenu === 'creationType') {
      return (
        <div
          className={`${styles.chatboxPopover} ${styles.chatboxPopoverCreationType}`}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className={styles.chatboxMenuList}>
            <div className={styles.chatboxMenuLabel}>Creation type</div>
            {CREATION_TYPE_OPTIONS.map((option) => {
              const Icon = option.key === 'video' ? Video : ImageIcon

              return (
                <button
                  type="button"
                  className={`${styles.chatboxMenuOption} ${
                    activeChatType === option.key ? styles.chatboxMenuOptionSelected : ''
                  }`}
                  key={option.key}
                  onClick={() => selectChatType(option.key)}
                >
                  <Icon size={16} />
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    if (activeChatMenu === 'videoMode') {
      return (
        <div className={`${styles.chatboxPopover} ${styles.chatboxPopoverVideoMode}`} onMouseDown={(event) => event.stopPropagation()}>
          <div className={styles.chatboxMenuList}>
            <div className={styles.chatboxMenuLabel}>Features</div>
            {VIDEO_MODE_OPTIONS.map((option) => (
              <button
                type="button"
                className={`${styles.chatboxMenuOption} ${videoMode === option ? styles.chatboxMenuOptionSelected : ''}`}
                key={option}
                onClick={() => selectVideoMode(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )
    }

    if (activeChatMenu === 'videoModel' || activeChatMenu === 'imageModel') {
      return (
        <div
          className={`${styles.chatboxPopover} ${
            activeChatMenu === 'videoModel' ? styles.chatboxPopoverVideoModel : styles.chatboxPopoverImageModel
          }`}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className={styles.chatboxModelCascader}>
            <div className={styles.chatboxModelCategories}>
              <div className={styles.chatboxMenuLabel}>Models</div>
              {activeModelGroups.map((group) => (
                <button
                  type="button"
                  className={`${styles.chatboxModelCategory} ${
                    activeModelCategory === group.key ? styles.chatboxModelCategoryActive : ''
                  }`}
                  key={group.key}
                  onMouseEnter={() =>
                    activeChatType === 'video'
                      ? setActiveVideoModelCategory(group.key)
                      : setActiveImageModelCategory(group.key)
                  }
                  onClick={() =>
                    activeChatType === 'video'
                      ? setActiveVideoModelCategory(group.key)
                      : setActiveImageModelCategory(group.key)
                  }
                >
                  {group.label}
                </button>
              ))}
            </div>
            <div className={styles.chatboxModelOptions}>
              {activeModelOptions.map((model) => (
                <button
                  type="button"
                  className={`${styles.chatboxModelOption} ${
                    modelChipLabel === model.name ? styles.chatboxModelOptionSelected : ''
                  }`}
                  key={model.slug}
                  onClick={() => selectModel(model)}
                >
                  <span className={styles.chatboxModelOptionHead}>
                    <span className={styles.chatboxModelOptionTitle}>
                      {renderModelMark(model, 'option')}
                      <span>{model.name}</span>
                    </span>
                    {model.badge ? <span className={styles.chatboxModelBadge}>{model.badge}</span> : null}
                  </span>
                  <span className={styles.chatboxModelDesc}>{model.description}</span>
                  <span className={styles.chatboxModelMeta}>{model.meta}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (activeChatMenu === 'videoParams') {
      return (
        <div className={`${styles.chatboxPopover} ${styles.chatboxPopoverVideoParams}`} onMouseDown={(event) => event.stopPropagation()}>
          <div className={styles.chatboxParamPanel}>
            <div className={styles.chatboxParamGroup}>
              <div className={styles.chatboxRangeHead}>
                <h4>Video Length</h4>
                <span>{durationLabel}</span>
              </div>
              <div className={styles.chatboxRangeControl} style={{ '--range-progress': `${videoDurationProgress}%` } as CSSProperties}>
                <input
                  type="range"
                  min={VIDEO_DURATION_MIN}
                  max={VIDEO_DURATION_MAX}
                  step={1}
                  value={videoDuration}
                  aria-label="Video length"
                  onChange={(event) => setVideoDuration(Number(event.target.value))}
                />
                <div className={styles.chatboxRangeLimits} aria-hidden="true">
                  <span>2s</span>
                  <span>15s</span>
                </div>
              </div>
            </div>
            <div className={styles.chatboxParamGroup}>
              <h4>Resolution</h4>
              <div className={`${styles.chatboxParamGrid} ${styles.chatboxParamGridThree}`}>
                {VIDEO_RESOLUTION_OPTIONS.map((option) => (
                  <button
                    type="button"
                    className={`${styles.chatboxParamButton} ${
                      videoResolution.toLowerCase() === option.toLowerCase() ? styles.chatboxParamButtonSelected : ''
                    }`}
                    key={option}
                    onClick={() => setVideoResolution(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.chatboxParamGroup}>
              <h4>Aspect Ratio</h4>
              <div className={`${styles.chatboxParamGrid} ${styles.chatboxParamGridFive}`}>
                {VIDEO_ASPECT_RATIO_OPTIONS.map((option) => (
                  <button
                    type="button"
                    className={`${styles.chatboxParamButton} ${
                      videoAspectRatio === option ? styles.chatboxParamButtonSelected : ''
                    }`}
                    key={option}
                    onClick={() => setVideoAspectRatio(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (activeChatMenu === 'imageParams') {
      return (
        <div className={`${styles.chatboxPopover} ${styles.chatboxPopoverImageParams}`} onMouseDown={(event) => event.stopPropagation()}>
          <div className={styles.chatboxParamPanel}>
            <div className={styles.chatboxParamGroup}>
              <h4>Aspect Ratio</h4>
              <div className={`${styles.chatboxParamGrid} ${styles.chatboxParamGridWrap}`}>
                {IMAGE_ASPECT_RATIO_OPTIONS.map((option) => (
                  <button
                    type="button"
                    className={`${styles.chatboxParamButton} ${
                      imageAspectRatio === option ? styles.chatboxParamButtonSelected : ''
                    }`}
                    key={option}
                    onClick={() => setImageAspectRatio(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.chatboxParamGroup}>
              <h4>Output Number</h4>
              <div className={`${styles.chatboxParamGrid} ${styles.chatboxParamGridFour}`}>
                {OUTPUT_NUMBER_OPTIONS.map((option) => (
                  <button
                    type="button"
                    className={`${styles.chatboxParamButton} ${
                      imageOutputCount === option ? styles.chatboxParamButtonSelected : ''
                    }`}
                    key={option}
                    onClick={() => setImageOutputCount(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (activeChatMenu === 'imageStyle') {
      return (
        <div className={`${styles.chatboxPopover} ${styles.chatboxPopoverImageStyle}`} onMouseDown={(event) => event.stopPropagation()}>
          <div className={styles.chatboxStylePanel}>
            <div className={styles.chatboxStyleHead}>
              <h4>Select Templates</h4>
              <input
                type="search"
                value={styleSearch}
                placeholder="Search template here"
                onChange={(event) => setStyleSearch(event.target.value)}
              />
            </div>
            {filteredImageStyles.length ? (
              <div className={styles.chatboxStyleGrid}>
                {filteredImageStyles.map((style) => (
                  <button
                    type="button"
                    className={`${styles.chatboxStyleOption} ${
                      imageStyle === style.name ? styles.chatboxStyleOptionSelected : ''
                    }`}
                    key={style.id}
                    onClick={() => {
                      setImageStyle(style.name)
                      setActiveChatMenu('')
                    }}
                  >
                    <span className={styles.chatboxStyleThumb} style={getStyleSwatch(style.name)} />
                    <span className={styles.chatboxStyleName}>{style.name}</span>
                    <span className={styles.chatboxStyleMeta}>{style.meta || 'Template'}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.chatboxStyleState}>No templates found</div>
            )}
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className={styles.chatbox} id="generator" ref={chatboxRef}>
      <div
        className={`${styles.chatboxInner} ${uploads.length ? styles.chatboxInnerHasUpload : ''} ${
          activeChatMenu ? styles.chatboxInnerMenuOpen : ''
        }`}
      >
        {uploads.length ? (
          <div className={styles.chatboxUploads}>
            {uploads.map((item) => (
              <div
                className={`${styles.chatboxThumb} ${item.status === 'error' ? styles.chatboxThumbError : ''}`}
                key={item.id}
              >
                {item.dataURL ? <img src={item.dataURL} alt={item.name || 'Uploaded reference'} /> : null}
                {item.status !== 'ready' ? (
                  <button
                    type="button"
                    className={styles.chatboxUploadStatus}
                    aria-label={item.status === 'error' ? 'Retry upload' : 'Image uploading'}
                    onClick={() => item.status === 'error' && retryUpload(item)}
                  >
                    <RefreshCw size={16} />
                  </button>
                ) : null}
                <button
                  type="button"
                  className={styles.chatboxRemove}
                  aria-label="Remove image"
                  onClick={() => removeUpload(item.id)}
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <label className={styles.srOnly} htmlFor={promptId}>
          Creative prompt
        </label>
        <div className={styles.chatboxEditor}>
          <div className={styles.chatboxLeftActions} ref={menuRef}>
            <div className={styles.chatboxUploadControl}>
              <button
                type="button"
                className={`${styles.chatboxUploadButton} ${menuOpen ? styles.chatboxUploadButtonActive : ''} ${
                  uploadLimitReached ? styles.chatboxUploadButtonDisabled : ''
                }`}
                aria-label={uploadLimitReached ? 'Upload up to 3 images' : 'Upload image'}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={() => {
                  if (uploadLimitReached) {
                    setTemporaryNotice('Upload up to 3 images')
                    return
                  }
                  setActiveChatMenu('')
                  setMenuOpen((value) => !value)
                }}
              >
                <span className={styles.chatboxUploadPlus} aria-hidden="true" />
              </button>
              {uploadLimitReached ? <span className={styles.chatboxTooltip}>Upload up to 3 images</span> : null}
            </div>

            {menuOpen ? (
              <div className={styles.chatboxUploadMenu} role="menu">
                <button type="button" role="menuitem" onClick={handleUploadClick}>
                  Upload from device
                </button>
                <button type="button" role="menuitem" onClick={openAssetPicker}>
                  Select from assets
                </button>
              </div>
            ) : null}

            <input
              ref={fileInputRef}
              className={styles.chatboxFileInput}
              type="file"
              accept={uploadAccept}
              multiple
              onChange={handleFileChange}
            />
          </div>

          <textarea
            id={promptId}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={animatedPlaceholder}
          />
        </div>

        <div className={styles.chatboxActions}>
          <div className={styles.chatboxChips}>
            <button
              type="button"
              className={`${styles.chatboxChip} ${styles.chatboxTypeChip} ${
                activeChatMenu === 'creationType' ? styles.chatboxChipOpen : ''
              }`}
              aria-haspopup="menu"
              aria-expanded={activeChatMenu === 'creationType'}
              onClick={() => toggleChatMenu('creationType')}
            >
              {activeChatType === 'video' ? <Video size={16} /> : <ImageIcon size={16} />}
              <span>{activeChatType === 'video' ? 'Video' : 'Image'}</span>
              <ChevronDown size={16} />
            </button>

            {activeChatType === 'video' ? (
              <button
                type="button"
                className={`${styles.chatboxChip} ${activeChatMenu === 'videoMode' ? styles.chatboxChipOpen : ''}`}
                onClick={() => toggleChatMenu('videoMode')}
              >
                <Clapperboard size={19} />
                <span>{videoMode}</span>
                <ChevronDown size={16} />
              </button>
            ) : null}

            <button
              type="button"
              className={`${styles.chatboxChip} ${activeChatMenu === (activeChatType === 'video' ? 'videoModel' : 'imageModel') ? styles.chatboxChipOpen : ''}`}
              onClick={() => toggleChatMenu(activeChatType === 'video' ? 'videoModel' : 'imageModel')}
            >
              {renderModelMark(activeModelItem)}
              <span>{modelChipLabel}</span>
              <ChevronDown size={16} />
            </button>

            <button
              type="button"
              className={`${styles.chatboxChip} ${styles.chatboxChipParams} ${
                activeChatMenu === (activeChatType === 'video' ? 'videoParams' : 'imageParams') ? styles.chatboxChipOpen : ''
              }`}
              onClick={() => toggleChatMenu(activeChatType === 'video' ? 'videoParams' : 'imageParams')}
            >
              <span className={styles.chatboxRatio} aria-hidden="true" />
              <span>{aspectRatioLabel}</span>
              {activeChatType === 'video' ? (
                <>
                  <span className={styles.chatboxDivider} />
                  <span>{durationLabel}</span>
                  <span className={styles.chatboxDivider} />
                  <span>{resolutionLabel}</span>
                </>
              ) : (
                <>
                  <span className={styles.chatboxDivider} />
                  <span>{imageOutputCount}</span>
                </>
              )}
            </button>

            {activeChatType === 'image' ? (
              <button
                type="button"
                className={`${styles.chatboxChip} ${styles.chatboxChipStyle} ${
                  activeChatMenu === 'imageStyle' ? styles.chatboxChipOpen : ''
                }`}
                onClick={() => {
                  setStyleSearch('')
                  toggleChatMenu('imageStyle')
                }}
              >
                <span className={styles.chatboxStyleSwatch} style={getStyleSwatch(imageStyle)} aria-hidden="true" />
                <span>{imageStyle}</span>
              </button>
            ) : null}
          </div>

          {notice ? <span className={styles.chatboxNotice}>{notice}</span> : null}

          <div className={styles.chatboxSendControl}>
            <button
              type="button"
              className={`${styles.chatboxSend} ${canSubmit ? styles.chatboxSendReady : styles.chatboxSendDisabled}`}
              aria-label={`Generate with ${displayName}`}
              aria-disabled={!canSubmit || isGenerating}
              disabled={!canSubmit || isGenerating}
              data-analytics-event="cta_clicked"
              data-analytics-location={analyticsLocation}
              data-analytics-label={`Generate with ${displayName}`}
              onClick={handleSubmit}
            >
              <span className={styles.chatboxSendLabel}>{isGenerating ? 'Generating' : 'Generate'}</span>
              <span className={styles.chatboxCredits}>
                {isGenerating ? <RefreshCw size={12} /> : <Sparkles size={12} />}
                {generateCredits}
              </span>
              <Send className={styles.chatboxSendIcon} size={18} />
            </button>
            <span className={styles.chatboxTooltip}>{sendTooltip}</span>
          </div>
        </div>

        {generationError ? (
          <div style={{ marginTop: 12, color: '#b42318', fontSize: 13 }}>{generationError}</div>
        ) : null}

        {generationResult ? (
          <div style={{ marginTop: 14, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(15, 23, 42, 0.12)' }}>
            {generationResult.mediaType === 'video' ? (
              <video src={generationResult.url} controls playsInline style={{ display: 'block', width: '100%', maxHeight: 420, background: '#000' }} />
            ) : (
              <img src={generationResult.url} alt="Generated result" style={{ display: 'block', width: '100%', maxHeight: 520, objectFit: 'contain', background: '#f8fafc' }} />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 12px', fontSize: 12, color: '#475467' }}>
              <span>{generationResult.endpoint || 'Yunwu generation'}</span>
              <a href={generationResult.url} target="_blank" rel="noreferrer">
                Open result
              </a>
            </div>
          </div>
        ) : null}

        {renderPopover()}
      </div>

      {assetPickerOpen ? (
        <div
          className={styles.assetPickerOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Select from assets"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeAssetPicker()
          }}
        >
          <div className={styles.assetPickerPanel} onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className={styles.assetPickerClose} aria-label="Close assets" onClick={closeAssetPicker}>
              <X size={16} />
            </button>

            <div className={styles.assetPickerHeader}>
              <h2>Select from assets</h2>
              <p>
                {selectedAssetIds.length}/{remainingAssetSlots} selected
              </p>
            </div>

            <div className={styles.assetPickerTabs} role="tablist" aria-label="Asset source">
              {ASSET_TABS.map((tab) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={assetTab === tab.key}
                  className={assetTab === tab.key ? styles.assetPickerTabActive : ''}
                  key={tab.key}
                  onClick={() => changeAssetTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={styles.assetPickerBody}>
              {assetLoading ? (
                <div className={styles.assetPickerState}>
                  <RefreshCw size={22} />
                  Loading assets...
                </div>
              ) : assetError ? (
                <div className={styles.assetPickerState}>{assetError}</div>
              ) : (
                <div className={styles.assetPickerGrid}>
                  {assetTab === 'upload' ? (
                    <button type="button" className={styles.assetPickerUploadTile} onClick={handleAssetUploadClick}>
                      <Upload size={24} />
                      <span>Upload</span>
                    </button>
                  ) : null}

                  {assetItems.map((item) => {
                    const selected = selectedAssetIds.includes(item.id)
                    return (
                      <button
                        type="button"
                        className={`${styles.assetPickerItem} ${selected ? styles.assetPickerItemSelected : ''}`}
                        key={item.id}
                        onClick={() => toggleAssetSelection(item)}
                      >
                        <img src={item.url} alt={item.title} />
                        {selected ? (
                          <span className={styles.assetPickerCheck}>
                            <Check size={15} />
                          </span>
                        ) : null}
                      </button>
                    )
                  })}

                  {!assetItems.length && assetTab !== 'upload' ? (
                    <div className={styles.assetPickerEmpty}>
                      <ImageIcon size={28} />
                      <span>No assets yet</span>
                      <Link href={assetsHref} onClick={closeAssetPicker}>
                        Open Assets
                      </Link>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div className={styles.assetPickerFooter}>
              <button
                type="button"
                className={styles.assetPickerConfirm}
                disabled={!selectedAssetIds.length}
                onClick={confirmAssetSelection}
              >
                Confirm
              </button>
              <button type="button" className={styles.assetPickerCancel} onClick={closeAssetPicker}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
