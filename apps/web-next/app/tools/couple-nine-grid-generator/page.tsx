'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowLeft,
  Download,
  Grid3X3,
  ImageIcon,
  Sparkles,
  Upload,
} from 'lucide-react'
import { trackEvent } from '../../../lib/analytics'

type GridTemplate = {
  id: string
  title: string
  description: string
  shots: string[]
}

type GeneratedGrid = {
  id: string
  imageUrl: string
  templateTitle: string
  generatedAt: Date
}

const GRID_TEMPLATES: GridTemplate[] = [
  {
    id: 'daily-date-story',
    title: 'Daily Date Story',
    description: 'A complete low-key date, from first meeting to the final close-up.',
    shots: [
      'wide shot walking side by side on a quiet street',
      'holding hands close-up with natural movement',
      'one partner gently fixing the other partner collar or hair',
      'laughing together at a cafe table',
      'mirror selfie style couple portrait without visible phone branding',
      'sharing a drink or dessert in a candid moment',
      'back-view walk under warm lights',
      'foreheads close with soft eye contact',
      'clean romantic close-up portrait looking at camera',
    ],
  },
  {
    id: 'long-distance-reunion',
    title: 'Reunion Diary',
    description: 'Emotional reunion frames that feel intimate, not staged.',
    shots: [
      'one partner waiting with a small bag or flowers',
      'first eye contact from a few steps away',
      'warm hug with faces visible and natural body language',
      'hands clasped tightly in a close-up crop',
      'walking away together with relaxed shoulders',
      'sitting close on a bench with quiet smiles',
      'playful candid laugh after the reunion',
      'soft cheek kiss, tasteful and affectionate',
      'peaceful close portrait with both identities clear',
    ],
  },
  {
    id: 'anniversary-filmstrip',
    title: 'Anniversary Filmstrip',
    description: 'More polished, cinematic frames for a relationship milestone.',
    shots: [
      'elegant wide couple portrait in evening light',
      'one partner holding a small bouquet or keepsake',
      'hands and rings or bracelets close-up, no text',
      'seated shoulder-to-shoulder portrait',
      'center hero frame, both partners smiling naturally at camera',
      'walking pose with one arm around waist',
      'close-up profile moment with gentle laughter',
      'backlit silhouette that still preserves recognizable faces',
      'final intimate portrait with warm cinematic depth of field',
    ],
  },
]

const LOCATIONS = [
  'cozy city cafe',
  'rainy evening street',
  'sunset campus path',
  'home kitchen morning',
  'museum courtyard',
  'rooftop golden hour',
]

const STYLES = [
  'realistic phone photography',
  'cinematic lifestyle photography',
  'Korean drama stills',
  'soft film camera look',
  'fresh first-love editorial',
]

function compressImage(file: File, maxSizePx = 1100, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new window.Image()
    const url = URL.createObjectURL(file)
    image.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxSizePx / Math.max(image.width, image.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(image.width * scale)
      canvas.height = Math.round(image.height * scale)
      const context = canvas.getContext('2d')
      if (!context) {
        reject(new Error('Canvas is not available.'))
        return
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    image.onerror = reject
    image.src = url
  })
}

function buildGridPrompt(template: GridTemplate, location: string, style: string, extraPrompt: string) {
  const shotList = template.shots.map((shot, index) => `${index + 1}. ${shot}`).join(' ')
  return [
    'Create one single square image that is a 3x3 nine-grid couple photo collage.',
    'Use the two uploaded partner portraits as identity references. Preserve both people facial identity, hairstyle, approximate age, skin tone, and natural proportions across every panel.',
    'The final output must contain exactly nine equal square panels arranged in three rows and three columns with thin clean white gutters between panels.',
    'Every panel should look like a different photo from the same couple story, not repeated duplicates. Keep clothing, identity, and relationship continuity consistent.',
    `Narrative template: ${template.title}. Panel directions: ${shotList}`,
    `Main location: ${location}. Visual style: ${style}.`,
    'Make the set feel authentic, romantic, tasteful, consent-forward, and shareable on social media. Use natural light, believable camera angles, realistic skin texture, and small lived-in details.',
    'No text, captions, logos, watermarks, extra people, duplicated faces, distorted hands, heavy filters, or collage labels.',
    extraPrompt ? `User direction: ${extraPrompt}` : '',
  ]
    .filter(Boolean)
    .join(' ')
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function UploadSlot({
  id,
  label,
  previewUrl,
  onChange,
}: {
  id: string
  label: string
  previewUrl: string | null
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div>
      <input id={id} hidden type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={onChange} />
      <button
        type="button"
        onClick={() => document.getElementById(id)?.click()}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 5',
          overflow: 'hidden',
          border: previewUrl ? '2px solid #e2557d' : '1.5px dashed #cfd7e5',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          cursor: 'pointer',
        }}
      >
        {previewUrl ? (
          <Image src={previewUrl} alt={label} fill style={{ objectFit: 'cover' }} unoptimized />
        ) : (
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#667085',
              fontSize: '13px',
              fontWeight: 800,
            }}
          >
            <Upload size={22} />
            {label}
          </span>
        )}
      </button>
    </div>
  )
}

export default function CoupleNineGridGeneratorPage() {
  const [partnerAPreview, setPartnerAPreview] = useState<string | null>(null)
  const [partnerBPreview, setPartnerBPreview] = useState<string | null>(null)
  const partnerARef = useRef<string | null>(null)
  const partnerBRef = useRef<string | null>(null)

  const [templateId, setTemplateId] = useState(GRID_TEMPLATES[0].id)
  const [location, setLocation] = useState(LOCATIONS[0])
  const [style, setStyle] = useState(STYLES[0])
  const [extraPrompt, setExtraPrompt] = useState('')
  const [, setUploadVersion] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [results, setResults] = useState<GeneratedGrid[]>([])

  const selectedTemplate = GRID_TEMPLATES.find((template) => template.id === templateId) || GRID_TEMPLATES[0]
  const canGenerate = Boolean(partnerARef.current && partnerBRef.current && !isGenerating)

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    imageRef: React.MutableRefObject<string | null>,
    uploadRole: string
  ) {
    const file = event.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    imageRef.current = await compressImage(file)
    setUploadVersion((value) => value + 1)
    trackEvent('upload_completed', {
      tool_name: 'couple_nine_grid_generator',
      upload_role: uploadRole,
      file_type: file.type,
      file_size_kb: Math.round(file.size / 1024),
    })
  }

  async function handleGenerate() {
    if (!partnerARef.current || !partnerBRef.current) {
      setErrorMsg('Please upload both partner photos first.')
      return
    }

    setIsGenerating(true)
    setErrorMsg(null)
    const prompt = buildGridPrompt(selectedTemplate, location, style, extraPrompt)
    trackEvent('generation_started', {
      tool_name: 'couple_nine_grid_generator',
      template_id: selectedTemplate.id,
    })

    try {
      const response = await fetch('/api/tools/model-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'image',
          model: 'gpt-image-2',
          mode: 'Reference to Image',
          aspectRatio: '1:1',
          resolution: '1k',
          count: 1,
          style: 'Realistic nine-grid couple collage',
          creditsCost: 10,
          prompt,
          uploads: [
            { name: 'partner-a.jpg', type: 'image/jpeg', dataURL: partnerARef.current },
            { name: 'partner-b.jpg', type: 'image/jpeg', dataURL: partnerBRef.current },
          ],
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        setErrorMsg(data.error || 'Generation failed. Please try another template or photo.')
        trackEvent('generation_failed', {
          tool_name: 'couple_nine_grid_generator',
          template_id: selectedTemplate.id,
          status: response.status,
        })
        return
      }

      setResults((current) => [
        {
          id: crypto.randomUUID(),
          imageUrl: data.url,
          templateTitle: selectedTemplate.title,
          generatedAt: new Date(data.generatedAt),
        },
        ...current,
      ])
      trackEvent('generation_succeeded', {
        tool_name: 'couple_nine_grid_generator',
        template_id: selectedTemplate.id,
      })
    } catch (error) {
      console.error('[couple-nine-grid-generator] fetch error:', error)
      setErrorMsg('Network error. Please check your connection and retry.')
      trackEvent('generation_failed', {
        tool_name: 'couple_nine_grid_generator',
        template_id: selectedTemplate.id,
        reason: 'network_error',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleDownload(item: GeneratedGrid) {
    const response = await fetch(item.imageUrl)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = blobUrl
    anchor.download = `couple-nine-grid-${item.generatedAt.getTime()}.png`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8faf9', padding: '32px 32px 80px 48px' }}>
      <main style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <Link
            href="/tools"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#101828',
              textDecoration: 'none',
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: 0,
            }}
          >
            <ArrowLeft size={20} />
            Couple Nine-Grid Generator
          </Link>
          <p style={{ maxWidth: '760px', margin: '12px 0 0 28px', color: '#667085', fontSize: '14px', lineHeight: 1.7 }}>
            Upload two partner portraits and turn them into one share-ready 3x3 couple photo story with nine connected romantic frames.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(340px, 430px) minmax(0, 1fr)',
            gap: '28px',
            alignItems: 'start',
          }}
        >
          <section
            aria-label="Couple nine-grid settings"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5ece8',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 12px 30px rgba(16, 24, 40, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Grid3X3 size={18} color="#e2557d" />
              <h2 style={{ margin: 0, fontSize: '15px', color: '#26303f' }}>Partner photos</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '22px' }}>
              <UploadSlot
                id="nine-grid-partner-a-upload"
                label="Partner A"
                previewUrl={partnerAPreview}
                onChange={(event) => handleFileChange(event, setPartnerAPreview, partnerARef, 'partner_a')}
              />
              <UploadSlot
                id="nine-grid-partner-b-upload"
                label="Partner B"
                previewUrl={partnerBPreview}
                onChange={(event) => handleFileChange(event, setPartnerBPreview, partnerBRef, 'partner_b')}
              />
            </div>

            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 800, color: '#344054' }}>
              Nine-grid story
            </label>
            <div style={{ display: 'grid', gap: '10px', marginBottom: '18px' }}>
              {GRID_TEMPLATES.map((template) => {
                const active = template.id === templateId
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setTemplateId(template.id)}
                    style={{
                      textAlign: 'left',
                      border: active ? '2px solid #e2557d' : '1px solid #e1e7ef',
                      borderRadius: '8px',
                      padding: '12px',
                      backgroundColor: active ? '#fff5f7' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ display: 'block', color: '#1d2939', fontSize: '13px', fontWeight: 900 }}>
                      {template.title}
                    </span>
                    <span style={{ display: 'block', color: '#667085', fontSize: '12px', lineHeight: 1.5, marginTop: '3px' }}>
                      {template.description}
                    </span>
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '13px', fontWeight: 800, color: '#344054' }}>
                Location
                <select
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  style={{ height: '40px', border: '1px solid #d7dde7', borderRadius: '8px', padding: '0 10px', backgroundColor: '#ffffff' }}
                >
                  {LOCATIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '13px', fontWeight: 800, color: '#344054' }}>
                Style
                <select
                  value={style}
                  onChange={(event) => setStyle(event.target.value)}
                  style={{ height: '40px', border: '1px solid #d7dde7', borderRadius: '8px', padding: '0 10px', backgroundColor: '#ffffff' }}
                >
                  {STYLES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '13px', fontWeight: 800, color: '#344054' }}>
              Extra direction
              <textarea
                value={extraPrompt}
                onChange={(event) => setExtraPrompt(event.target.value)}
                placeholder="Optional: matching outfits, season, city, anniversary theme..."
                rows={3}
                style={{
                  resize: 'vertical',
                  border: '1px solid #d7dde7',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '13px',
                  lineHeight: 1.5,
                }}
              />
            </label>

            {errorMsg ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '9px',
                  marginTop: '14px',
                  padding: '11px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#fff1f1',
                  border: '1px solid #ffd0d0',
                  color: '#b42318',
                  fontSize: '13px',
                  lineHeight: 1.5,
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                {errorMsg}
              </div>
            ) : null}

            <button
              type="button"
              disabled={!canGenerate}
              onClick={handleGenerate}
              style={{
                width: '100%',
                height: '48px',
                marginTop: '18px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: canGenerate ? '#e2557d' : '#e4e7ec',
                color: canGenerate ? '#ffffff' : '#98a2b3',
                fontSize: '15px',
                fontWeight: 900,
                cursor: canGenerate ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Sparkles size={18} style={isGenerating ? { animation: 'spin 1.4s linear infinite' } : undefined} />
              {isGenerating ? 'Generating...' : 'Generate Nine-Grid'}
            </button>
          </section>

          <section
            aria-label="Generated couple nine-grid images"
            style={{
              minHeight: '760px',
              backgroundColor: '#141716',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #242a28',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '18px 20px',
                borderBottom: '1px solid #28302d',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Grid3X3 size={17} color="#ff8aa5" />
                <h2 style={{ margin: 0, color: '#ffffff', fontSize: '15px' }}>Preview Results</h2>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>{results.length} generated</span>
            </div>

            <div style={{ padding: '18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {isGenerating ? (
                <div
                  style={{
                    aspectRatio: '1 / 1',
                    borderRadius: '8px',
                    background: 'linear-gradient(90deg, #202625 25%, #2d3532 50%, #202625 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.4s infinite',
                  }}
                />
              ) : null}

              {results.map((item) => (
                <article key={item.id} style={{ overflow: 'hidden', borderRadius: '8px', backgroundColor: '#202625', border: '1px solid #313a36' }}>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1' }}>
                    <Image src={item.imageUrl} alt={item.templateTitle} fill style={{ objectFit: 'cover' }} unoptimized={item.imageUrl.startsWith('data:')} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px' }}>
                    <div>
                      <div style={{ color: '#ffffff', fontSize: '12px', fontWeight: 800 }}>{item.templateTitle}</div>
                      <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', marginTop: '2px' }}>{formatTime(item.generatedAt)}</div>
                    </div>
                    <button
                      type="button"
                      title="Download"
                      onClick={() => handleDownload(item)}
                      style={{
                        width: '32px',
                        height: '32px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        color: '#ffffff',
                        cursor: 'pointer',
                      }}
                    >
                      <Download size={15} />
                    </button>
                  </div>
                </article>
              ))}

              {!isGenerating && results.length === 0 ? (
                <div
                  style={{
                    minHeight: '520px',
                    gridColumn: '1 / -1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.58)',
                    textAlign: 'center',
                    gap: '12px',
                    padding: '24px',
                  }}
                >
                  <ImageIcon size={44} />
                  <p style={{ maxWidth: '380px', margin: 0, fontSize: '14px', lineHeight: 1.7 }}>
                    Your generated nine-grid couple story will appear here as one square collage after both partner photos are uploaded.
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </main>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @media (max-width: 980px) {
          main > div:nth-of-type(2) {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          body {
            overflow-x: hidden;
          }
        }
      `}</style>
    </div>
  )
}
