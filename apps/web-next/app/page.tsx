"use client"

import { Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import type { MediaItem } from '../types/media'
import dynamic from 'next/dynamic'
const ImageGallery = dynamic(() => import('../components/ImageGallery').then(m => m.ImageGallery), { ssr: false })
import { AuthButton } from '../components/AuthButton'
import { ImageDetailModal } from '../components/ImageDetailModal'
import './globals.css'

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
  //认证功能开关
  const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'
  // 认证状态
  const { status } = authEnabled ? useSession() : ({ status: 'unauthenticated' } as any)
  const isAuthenticated = status === 'authenticated'
  // State to manage the selected image item for modal display
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  // State to manage the list of image items to display
  const [items, setItems] = useState<MediaItem[]>(mockItems)

  useEffect(() => {
    const fetchList = async () => {
      try {
        // 调用API获取图片列表
        const res = await fetch('/api/images?page=1&size=20')
        if (!res.ok) return
        const data = await res.json()
        // 映射数据为 MediaItem 类型
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
        // 只有当获取到有效数据时才更新状态
        if (mapped.length) setItems(mapped)
      } catch {
        // keep mockItems
      }
    }
    fetchList()
  }, [])

  const handleLogin = () => (authEnabled ? signIn('google') : undefined)
  const handleLogout = () => (authEnabled ? signOut() : undefined)
  const handleItemClick = (item: MediaItem) => setSelectedItem(item)
  const handleCloseModal = () => setSelectedItem(null)

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-[1920px] mx-auto px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-gray-900" />
            <span className="text-lg text-gray-900">AI Image Gallery</span>
          </div>
          <AuthButton isAuthenticated={isAuthenticated} onLogin={handleLogin} onLogout={handleLogout} />
        </div>
      </header>

      <main className="pt-16 px-4 pb-8">
        <div className="max-w-[1920px] mx-auto">
          <ImageGallery items={items} onItemClick={handleItemClick} />
        </div>
      </main>

      {selectedItem && <ImageDetailModal item={selectedItem} onClose={handleCloseModal} />}
    </div>
  )
}
