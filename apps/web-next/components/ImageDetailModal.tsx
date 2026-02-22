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
  const [detail, setDetail] = useState<Partial<MediaItem> | null>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    let aborted = false
    const needFetch = !item.prompt || !item.reference_image || item.reference_image.length === 0
    if (!needFetch) {
      return
    }
    ; (async () => {
      try {
        const res = await fetch(`/api/images/${item.id}`)
        if (!res.ok) return
        const data = await res.json()
        if (aborted) return
        const merged: Partial<MediaItem> = {
          prompt: data.prompt ?? item.prompt,
          duration: data.duration ?? item.duration,
          reference_image: data.reference_image ?? item.reference_image,
          fullUrl: data.fullUrl ?? item.fullUrl,
          width: data.width ?? item.width,
          height: data.height ?? item.height,
          model: data.model ?? item.model,
          id: item.id,
          type: item.type,
          thumbnailUrl: item.thumbnailUrl,
        }
        setDetail(merged)
      } catch { }
    })()
    return () => {
      aborted = true
    }
  }, [item.id])

  // Handle backdrop click to close modal（确保打开窗口后页面不会滚动）
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
  //实现下载功能
  const handleDownload = async () => {
    try {
      const response = await fetch((detail?.fullUrl ?? item.fullUrl) as string)
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

  const promptText = (detail?.prompt ?? item.prompt) as string
  const promptPreview = promptText.substring(0, 100)
  const shouldShowToggle = promptText.length > 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleBackdropClick}>
      <div className="bg-white w-[1024px] h-[768px] overflow-hidden flex flex-col md:flex-row relative rounded-[12px]">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition-colors z-10">
          <X className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1 bg-gray-50 flex items-center justify-center p-12">
          <div className="relative w-full h-full flex items-center justify-center">
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
              </div>
            )}
            {item.type === 'video' ? (
              <video
                src={(detail?.fullUrl ?? item.fullUrl) as string}
                controls
                preload="none"
                loop
                playsInline
                className={`w-full h-full object-contain transition-opacity duration-300 outline-none ${isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                onLoadedData={() => setIsLoaded(true)}
              />
            ) : (
              <NextImageWithFallback
                src={(detail?.fullUrl ?? item.fullUrl) as string}
                alt={promptText}
                className={`w-full h-full object-contain transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                width={(detail?.width ?? item.width) as number}
                height={(detail?.height ?? item.height) as number}
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
                <div className="text-sm text-gray-900">{detail?.model ?? item.model}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2">Prompt</div>
                <div className="text-sm text-gray-900">
                  {isPromptExpanded || !shouldShowToggle ? <p>{promptText}</p> : <p>{promptPreview}...</p>}
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
                  {(detail?.width ?? item.width) as number} × {(detail?.height ?? item.height) as number} px
                  {(detail?.duration ?? item.duration) && <span className="ml-2 text-gray-500">({detail?.duration ?? item.duration})</span>}
                </div>
              </div>
              {((detail?.reference_image ?? item.reference_image) ?? []).length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 mb-2">Reference Images</div>
                  <div className="grid grid-cols-3 gap-2">
                    {((detail?.reference_image ?? item.reference_image) as string[]).map((url, idx) => (
                      <a key={`${item.id}-ref-${idx}`} href={url} target="_blank" rel="noopener noreferrer" className="block">
                        <NextImageWithFallback
                          src={url}
                          alt="reference image"
                          width={96}
                          height={96}
                          className="w-full h-24 object-cover rounded"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
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
