import React from 'react'
"use client"
import dynamic from 'next/dynamic'
const ResponsiveMasonry = dynamic(() => import('react-responsive-masonry').then(m => m.ResponsiveMasonry), { ssr: false })
const Masonry = dynamic(() => import('react-responsive-masonry').then(m => m.default), { ssr: false })
import { ImageCard } from './ImageCard'
import type { MediaItem } from '../types/media'

interface ImageGalleryProps {
  items: MediaItem[]
  onItemClick: (item: MediaItem) => void
}

export function ImageGallery({ items, onItemClick }: ImageGalleryProps) {
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1024: 3, 1440: 4, 1920: 6 }}>
      <Masonry gutter="20px">
        {items.map((item) => (
          <ImageCard key={item.id} item={item} onClick={() => onItemClick(item)} />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  )
}
