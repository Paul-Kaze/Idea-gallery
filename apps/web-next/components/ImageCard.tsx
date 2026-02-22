import React, { useState, useRef, useEffect } from 'react'
import { Play } from 'lucide-react'
import { NextImageWithFallback } from './figma/NextImageWithFallback'
import type { MediaItem } from '../types/media'

interface ImageCardProps {
  item: MediaItem
  onClick: () => void
}

export function ImageCard({ item, onClick }: ImageCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 监听卡片是否进入视口
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)// 卡片进入视口时设置为 true
            observer.unobserve(entry.target)// 取消监听，避免重复触发
          }
        })
      },
      { rootMargin: '200px' }// 提前触发加载的 margin
    )

    if (cardRef.current) observer.observe(cardRef.current)
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current)
    }
  }, [])

  const handleRetry = () => {
    setHasError(false)
    setIsLoaded(false)
    setIsInView(true)
  }

  return (
    <div
      ref={cardRef}
      className="relative w-full overflow-hidden bg-gray-100 cursor-pointer group rounded-[8px]"
      style={{ aspectRatio: `${item.width} / ${item.height}` }}
      onClick={onClick}
    >
      {!isInView ? (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-[8px]" />
      ) : hasError ? (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center rounded-[8px]">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleRetry()
            }}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Failed to load, click to retry
          </button>
        </div>
      ) : (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-[8px] z-0" />
          )}

          <NextImageWithFallback
            src={item.thumbnailUrl}
            alt={`AI generated: ${item.prompt.substring(0, 50)}...`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 rounded-[8px] z-10 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            fill
            sizes="100vw"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />

          {item.type === 'video' && isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-black/70 transition-colors">
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>
              {item.duration && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  {item.duration}
                </div>
              )}
            </div>
          )}

          {item.type === 'video' ? (
            <video
              src={item.fullUrl}
              className="absolute inset-0 w-full h-full object-cover rounded-[8px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30"
              muted
              loop
              playsInline
              poster={item.thumbnailUrl}
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => {
                e.currentTarget.pause()
                e.currentTarget.currentTime = 0
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-all duration-200 rounded-[8px] z-30" />
          )}
        </>
      )}
    </div>
  )
}
