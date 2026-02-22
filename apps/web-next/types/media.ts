export interface MediaItem {
  id: string
  type: 'image' | 'video'
  thumbnailUrl: string
  fullUrl: string
  model: string
  prompt: string
  width: number
  height: number
  duration?: string
  reference_image?: string[]
}
