import React, { useState, useEffect } from 'react'
import { X, Download, ChevronDown, ChevronUp } from 'lucide-react'
import { NextImageWithFallback } from './figma/NextImageWithFallback'
import type { MediaItem } from '../types/media'

interface ImageDetailModalProps {
  item: MediaItem
  onClose: () => void
}

export function ImageDetailModal({ item, onClose }: ImageDetailModalProps) {
  const [isPromptExpanded, setIsPromptExpanded] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Handle backdrop click to close modal（确保打开窗口后页面不会滚动）
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
  //实现下载功能
  const handleDownload = async () => {
    try {
      const response = await fetch(item.fullUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const extension = item.type === 'video' ? 'mp4' : 'jpg'
      link.download = `ai-${item.type}-${item.id}.${extension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const promptPreview = item.prompt.substring(0, 100)
  const shouldShowToggle = item.prompt.length > 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4" onClick={handleBackdropClick}>
      <div className="bg-white max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative rounded-[12px]">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition-colors z-10">
          <X className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1 bg-gray-50 flex items-center justify-center p-12 min-h-[300px] md:min-h-0">
          <div className="relative w-full h-full flex items-center justify-center">
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
              </div>
            )}
            {item.type === 'video' ? (
              <video
                src={item.fullUrl}
                controls
                preload="none"
                loop
                playsInline
                className={`max-w-full max-h-[70vh] object-contain transition-opacity duration-300 outline-none ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoadedData={() => setIsLoaded(true)}
              />
            ) : (
              <NextImageWithFallback
                src={item.fullUrl}
                alt={item.prompt}
                className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                width={item.width}
                height={item.height}
                onLoad={() => setIsLoaded(true)}
              />
            )}
          </div>
        </div>
        <div className="w-full md:w-96 bg-white flex flex-col">
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <div className="text-xs text-gray-500 mb-2">Model</div>
                <div className="text-sm text-gray-900">{item.model}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2">Prompt</div>
                <div className="text-sm text-gray-900">
                  {isPromptExpanded || !shouldShowToggle ? <p>{item.prompt}</p> : <p>{promptPreview}...</p>}
                  {shouldShowToggle && (
                    <button onClick={() => setIsPromptExpanded(!isPromptExpanded)} className="flex items-center gap-1 mt-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      {isPromptExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Show More
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2">{item.type === 'video' ? 'Resolution' : 'Dimensions'}</div>
                <div className="text-sm text-gray-900">
                  {item.width} × {item.height} px
                  {item.duration && <span className="ml-2 text-gray-500">({item.duration})</span>}
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 p-8">
            <button onClick={handleDownload} className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white hover:bg-gray-700 transition-colors text-sm">
              <Download className="w-4 h-4" />
              Download {item.type === 'video' ? 'Video' : 'Image'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
