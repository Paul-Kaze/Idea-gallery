"use client"

import { useEffect, useState } from 'react'
import type { MediaItem } from '../types/media'
import dynamic from 'next/dynamic'
import { ImageDetailModal } from '../components/ImageDetailModal'

const ImageGallery = dynamic(() => import('../components/ImageGallery').then(m => m.ImageGallery), { ssr: false })

export default function Page() {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [items, setItems] = useState<MediaItem[]>([])

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
        setItems(mapped)
      } catch {
        setItems([])
      }
    }
    fetchList()
  }, [])

  const handleItemClick = (item: MediaItem) => setSelectedItem(item)
  const handleCloseModal = () => setSelectedItem(null)
  const handleItemLoadError = (item: MediaItem) => {
    setItems((current) => current.filter((currentItem) => currentItem.id !== item.id))
    setSelectedItem((current) => (current?.id === item.id ? null : current))
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        padding: '32px 32px 32px 48px',
      }}
    >
      <div style={{ maxWidth: '1920px', margin: '0 auto' }}>
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

        {items.length ? (
          <ImageGallery
            items={items}
            onItemClick={handleItemClick}
            onItemLoadError={handleItemLoadError}
          />
        ) : (
          <div
            style={{
              padding: '48px 32px',
              border: '1px solid #e5e7eb',
              borderRadius: 18,
              background: '#ffffff',
              color: '#64748b',
              textAlign: 'center',
            }}
          >
            No public gallery assets yet. Create from the tools page or connect production data.
          </div>
        )}
      </div>

      {selectedItem && <ImageDetailModal item={selectedItem} onClose={handleCloseModal} />}
    </div>
  )
}
