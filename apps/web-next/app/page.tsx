"use client"

import { useEffect, useState } from 'react'
import type { MediaItem } from '../types/media'
import dynamic from 'next/dynamic'
const ImageGallery = dynamic(() => import('../components/ImageGallery').then(m => m.ImageGallery), { ssr: false })
import { ImageDetailModal } from '../components/ImageDetailModal'

const mockItems: MediaItem[] = [
  {
    id: '1',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800',
    fullUrl:
      'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwY2l0eXNjYXBlfGVufDF8fHx8MTc2NDM5NDAzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    model: 'Gemini 3 Pro',
    prompt:
      'A futuristic cityscape at night with towering skyscrapers, neon lights reflecting on wet streets, flying cars in the sky, cyberpunk aesthetic, highly detailed, 8k resolution',
    width: 1200,
    height: 1600,
  },
  {
    id: '2',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1705254613735-1abb457f8a60?w=800',
    fullUrl:
      'https://images.unsplash.com/photo-1705254613735-1abb457f8a60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGFydCUyMGNvbG9yZnVsfGVufDF8fHx8MTc2NDMzOTM5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    model: 'DALL-E 4',
    prompt:
      'Abstract colorful swirls and patterns, vibrant gradients of pink, blue, orange and purple, fluid dynamics, digital art, mesmerizing composition',
    width: 1200,
    height: 800,
  },
  {
    id: 'v1',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535016120720-40c6874c3b13?w=800',
    fullUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    model: 'Sora v1',
    prompt:
      'Cinematic drone shot of a volcanic landscape with active lava flows, smoke rising, dramatic lighting, 4k video',
    width: 1920,
    height: 1080,
    duration: '0:15',
  },
]

export default function Page() {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [items, setItems] = useState<MediaItem[]>(mockItems)

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch('/api/images?page=1&size=20')
        if (!res.ok) return
        const data = await res.json()
        const mapped: MediaItem[] = (data.items ?? []).map((it: any) => ({
          id: it.id,
          type: it.type,
          thumbnailUrl: it.thumbnailUrl,
          fullUrl: it.fullUrl ?? it.thumbnailUrl,
          model: it.model,
          prompt: '',
          width: it.width,
          height: it.height,
        }))
        if (mapped.length) setItems(mapped)
      } catch {
        // keep mockItems
      }
    }
    fetchList()
  }, [])

  const handleItemClick = (item: MediaItem) => setSelectedItem(item)
  const handleCloseModal = () => setSelectedItem(null)

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        padding: '32px 32px 32px 48px',
      }}
    >
      <div style={{ maxWidth: '1920px', margin: '0 auto' }}>
        {/* Discover Heading */}
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#101828',
            letterSpacing: '0.07px',
            lineHeight: '32px',
            marginBottom: '32px',
            marginTop: 0,
          }}
        >
          Discover
        </h1>

        {/* Gallery */}
        <ImageGallery items={items} onItemClick={handleItemClick} />
      </div>

      {selectedItem && <ImageDetailModal item={selectedItem} onClose={handleCloseModal} />}
    </div>
  )
}
