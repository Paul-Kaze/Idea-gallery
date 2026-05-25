"use client"

import { useEffect, useState } from 'react'
import type { MediaItem } from '../types/media'
import dynamic from 'next/dynamic'
import { ImageDetailModal } from '../components/ImageDetailModal'

const ImageGallery = dynamic(() => import('../components/ImageGallery').then(m => m.ImageGallery), { ssr: false })
const COUPLE_SHOWCASE_BASE_URL = 'https://gallery-paul.oss-ap-southeast-1.aliyuncs.com/local-test-assets/couple-private-album/generated'

const FEATURED_COUPLE_ITEMS: MediaItem[] = [
  {
    id: 'featured-couple-01',
    type: 'image',
    thumbnailUrl: `${COUPLE_SHOWCASE_BASE_URL}/couple_collage_01_12_french_woman_youthful_beautiful.webp`,
    fullUrl: `${COUPLE_SHOWCASE_BASE_URL}/couple_collage_01_12_french_woman_youthful_beautiful.webp`,
    model: 'gpt-image-2',
    prompt: 'Private album style romantic couple collage with a French female portrait reference.',
    width: 1080,
    height: 1080,
  },
  {
    id: 'featured-couple-02',
    type: 'image',
    thumbnailUrl: `${COUPLE_SHOWCASE_BASE_URL}/couple_collage_02_16_middle_eastern_woman_beautiful_olive.webp`,
    fullUrl: `${COUPLE_SHOWCASE_BASE_URL}/couple_collage_02_16_middle_eastern_woman_beautiful_olive.webp`,
    model: 'gpt-image-2',
    prompt: 'Private album style romantic couple collage with a Middle Eastern female portrait reference.',
    width: 1080,
    height: 1080,
  },
  {
    id: 'featured-couple-03',
    type: 'image',
    thumbnailUrl: `${COUPLE_SHOWCASE_BASE_URL}/couple_collage_03_18_japanese_woman_fresh_pretty.webp`,
    fullUrl: `${COUPLE_SHOWCASE_BASE_URL}/couple_collage_03_18_japanese_woman_fresh_pretty.webp`,
    model: 'gpt-image-2',
    prompt: 'Private album style romantic couple collage with a Japanese female portrait reference.',
    width: 1080,
    height: 1080,
  },
  {
    id: 'featured-couple-04',
    type: 'image',
    thumbnailUrl: `${COUPLE_SHOWCASE_BASE_URL}/couple_collage_04_20_british_woman_young_beautiful_elegant.webp`,
    fullUrl: `${COUPLE_SHOWCASE_BASE_URL}/couple_collage_04_20_british_woman_young_beautiful_elegant.webp`,
    model: 'gpt-image-2',
    prompt: 'Private album style romantic couple collage with a British female portrait reference.',
    width: 1080,
    height: 1080,
  },
  {
    id: 'featured-couple-05',
    type: 'image',
    thumbnailUrl: `${COUPLE_SHOWCASE_BASE_URL}/couple_collage_05_22_spanish_woman_young_beautiful_glow.webp`,
    fullUrl: `${COUPLE_SHOWCASE_BASE_URL}/couple_collage_05_22_spanish_woman_young_beautiful_glow.webp`,
    model: 'gpt-image-2',
    prompt: 'Private album style romantic couple collage with a Spanish female portrait reference.',
    width: 1080,
    height: 1080,
  },
  {
    id: 'featured-couple-06',
    type: 'image',
    thumbnailUrl: `${COUPLE_SHOWCASE_BASE_URL}/couple_collage_06_26_american_woman_young_beautiful_fresh.webp`,
    fullUrl: `${COUPLE_SHOWCASE_BASE_URL}/couple_collage_06_26_american_woman_young_beautiful_fresh.webp`,
    model: 'gpt-image-2',
    prompt: 'Private album style romantic couple collage with an American female portrait reference.',
    width: 1080,
    height: 1080,
  },
  {
    id: 'featured-couple-07',
    type: 'image',
    thumbnailUrl: `${COUPLE_SHOWCASE_BASE_URL}/couple_collage_07_36_american_woman_campus_sunshine_pretty.webp`,
    fullUrl: `${COUPLE_SHOWCASE_BASE_URL}/couple_collage_07_36_american_woman_campus_sunshine_pretty.webp`,
    model: 'gpt-image-2',
    prompt: 'Private album style romantic couple collage with an American campus female portrait reference.',
    width: 1080,
    height: 1080,
  },
  {
    id: 'featured-couple-08',
    type: 'image',
    thumbnailUrl: `${COUPLE_SHOWCASE_BASE_URL}/couple_collage_08_42_american_woman_honors_student_beautiful.webp`,
    fullUrl: `${COUPLE_SHOWCASE_BASE_URL}/couple_collage_08_42_american_woman_honors_student_beautiful.webp`,
    model: 'gpt-image-2',
    prompt: 'Private album style romantic couple collage with an American honors student portrait reference.',
    width: 1080,
    height: 1080,
  },
]

export default function Page() {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [items, setItems] = useState<MediaItem[]>(FEATURED_COUPLE_ITEMS)

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
        setItems((current) => {
          const existingIds = new Set(current.map((item) => item.id))
          const merged = [...current]
          for (const item of mapped) {
            if (!existingIds.has(item.id)) {
              merged.push(item)
            }
          }
          return merged
        })
      } catch {
        setItems(FEATURED_COUPLE_ITEMS)
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
