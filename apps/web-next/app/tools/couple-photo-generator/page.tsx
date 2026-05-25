'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  Download,
  Heart,
  ImageIcon,
  Sparkles,
  Upload,
} from 'lucide-react'
import { trackEvent } from '../../../lib/analytics'

type PoseOption = {
  id: string
  title: string
  category: string
  prompt: string
}

type GeneratedImage = {
  id: string
  imageUrl: string
  poseTitle: string
  generatedAt: Date
}

const POSES: PoseOption[] = [
  {
    id: 'hugging-rain-street',
    title: 'Waist Hug Walk',
    category: 'Hugging arm around waist',
    prompt:
      'one partner wraps an arm around the other partner waist while they lean close, walking slowly with relaxed candid smiles',
  },
  {
    id: 'hugging-sunset-crosswalk',
    title: 'Sunset Crosswalk',
    category: 'Hugging arm around waist',
    prompt:
      'a warm walking pose with one partner holding the other around the waist, natural movement, soft eye contact, easy everyday affection',
  },
  {
    id: 'cafe-height-difference',
    title: 'Cafe Lean-In',
    category: 'Height difference sitting',
    prompt:
      'one partner sits while the other leans close behind or beside them, height difference visible, quiet intimate cafe feeling',
  },
  {
    id: 'campus-bench',
    title: 'Campus Bench',
    category: 'Height difference sitting',
    prompt:
      'one partner sits on a bench and looks up while the other bends close with a gentle first-love feeling',
  },
  {
    id: 'cheek-kiss-cafe',
    title: 'Shy Cheek Kiss',
    category: 'Kissing closeup hand cover',
    prompt:
      'close-up cheek kiss, the kissed partner smiles shyly and partly covers the smile with one hand, sweet and restrained',
  },
  {
    id: 'elevator-hand-cover',
    title: 'Hand-Cover Laugh',
    category: 'Kissing closeup hand cover',
    prompt:
      'close-up affectionate moment with a soft cheek kiss, shy hand-cover laugh, warm indoor light, private but tasteful',
  },
  {
    id: 'museum-half-kneel',
    title: 'Half-Kneel Hands',
    category: 'Couple close half kneel',
    prompt:
      'one partner sits on a low ledge while the other half-kneels close and holds both hands, tender proposal-like daily moment',
  },
  {
    id: 'rooftop-half-kneel',
    title: 'Rooftop Foreheads',
    category: 'Couple close half kneel',
    prompt:
      'one partner sits on a low wall while the other half-kneels nearby, holding hands, foreheads almost touching, quiet evening romance',
  },
]

const SCENES = [
  'rainy city street',
  'sunset crosswalk',
  'cozy cafe',
  'apartment elevator',
  'campus bench',
  'museum courtyard',
  'home kitchen morning',
  'rooftop evening',
]

const MOODS = ['romantic', 'playful', 'quiet and intimate', 'cinematic daily life', 'fresh first-love feeling']
const ASPECT_RATIOS = ['3:4', '4:3', '1:1', '9:16']

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

function buildPrompt(pose: PoseOption, scene: string, mood: string, extraPrompt: string) {
  return [
    'Create a realistic lifestyle couple photo from the two uploaded partner portraits.',
    'Preserve each person facial identity, hairstyle, approximate age, and natural body proportions from the uploaded photos.',
    `Use the selected pose reference as composition guidance: ${pose.prompt}.`,
    `Scene: ${scene}. Mood: ${mood}.`,
    'Make it feel like an authentic everyday romantic snapshot, not a fashion poster or studio shoot.',
    'Use natural skin texture, real camera depth of field, warm believable light, casual clothing, and small lived-in details.',
    'Keep the affection sweet, tasteful, and consent-forward. No text, watermark, distorted hands, extra people, duplicated faces, or uncanny expressions.',
    extraPrompt ? `User direction: ${extraPrompt}` : '',
  ]
    .filter(Boolean)
    .join(' ')
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function getPoseSketchBody(id: string) {
  switch (id) {
    case 'hugging-rain-street':
      return `
        <path d="M40 212 C78 184 112 172 150 177 C190 183 214 205 236 242" />
        <circle cx="118" cy="99" r="25" />
        <circle cx="188" cy="94" r="24" />
        <path d="M124 124 C116 153 102 181 78 220" />
        <path d="M184 118 C186 153 198 186 224 226" />
        <path d="M139 152 C163 169 188 169 211 151" />
        <path d="M170 122 C154 140 137 150 112 154" />
        <path d="M82 220 C71 262 73 300 91 340" />
        <path d="M126 220 C149 258 157 294 150 338" />
        <path d="M221 226 C241 260 248 298 240 342" />
        <path d="M181 224 C163 260 157 297 165 340" />
        <path d="M68 82 C94 59 125 51 158 59" />
        <path d="M178 56 C209 45 238 52 262 77" />
      `
    case 'hugging-sunset-crosswalk':
      return `
        <path d="M46 266 C82 252 117 247 153 252 C188 258 218 274 249 302" />
        <circle cx="111" cy="102" r="24" />
        <circle cx="181" cy="101" r="24" />
        <path d="M114 127 C104 157 88 190 63 238" />
        <path d="M180 126 C181 166 197 207 231 252" />
        <path d="M131 149 C156 161 180 162 204 148" />
        <path d="M171 132 C149 149 126 157 98 157" />
        <path d="M67 236 C85 271 92 306 82 341" />
        <path d="M112 229 C135 267 150 301 150 340" />
        <path d="M229 252 C247 285 251 317 244 345" />
        <path d="M192 235 C173 270 164 303 168 340" />
        <path d="M26 344 L274 344" />
        <path d="M42 318 L258 318" />
      `
    case 'cafe-height-difference':
      return `
        <path d="M54 259 L170 259 L183 344" />
        <path d="M42 344 L214 344" />
        <circle cx="111" cy="130" r="25" />
        <circle cx="190" cy="91" r="23" />
        <path d="M109 155 C108 188 94 217 73 258" />
        <path d="M128 158 C151 189 169 222 174 260" />
        <path d="M188 116 C180 148 163 174 135 195" />
        <path d="M198 116 C211 152 217 190 211 229" />
        <path d="M169 141 C150 154 135 160 115 162" />
        <path d="M82 260 C70 289 71 318 82 344" />
        <path d="M142 260 C158 289 168 317 166 344" />
      `
    case 'campus-bench':
      return `
        <path d="M42 247 L232 247" />
        <path d="M58 247 L49 344" />
        <path d="M216 247 L231 344" />
        <circle cx="119" cy="134" r="24" />
        <circle cx="195" cy="85" r="24" />
        <path d="M116 158 C106 187 91 214 70 247" />
        <path d="M132 158 C157 186 174 214 181 247" />
        <path d="M194 110 C185 145 166 172 132 190" />
        <path d="M205 111 C218 148 222 184 213 220" />
        <path d="M172 137 C154 145 136 148 116 146" />
        <path d="M80 247 C73 283 83 315 105 344" />
        <path d="M171 247 C184 281 191 314 187 344" />
      `
    case 'cheek-kiss-cafe':
      return `
        <circle cx="112" cy="115" r="36" />
        <circle cx="189" cy="111" r="34" />
        <path d="M138 112 C152 105 164 104 178 111" />
        <path d="M145 141 C166 151 187 150 208 138" />
        <path d="M105 151 C101 181 86 209 61 240" />
        <path d="M196 145 C203 178 221 210 249 238" />
        <path d="M151 177 C139 194 129 216 121 242" />
        <path d="M178 155 C166 166 154 173 139 177" />
        <path d="M212 130 C232 134 243 147 246 166" />
        <path d="M230 145 C219 153 210 163 204 176" />
        <path d="M68 244 C110 268 168 274 232 244" />
      `
    case 'elevator-hand-cover':
      return `
        <path d="M54 68 L246 68 L246 346 L54 346 Z" />
        <circle cx="116" cy="128" r="34" />
        <circle cx="187" cy="126" r="34" />
        <path d="M142 127 C155 117 166 116 177 126" />
        <path d="M111 162 C104 194 90 223 66 258" />
        <path d="M191 160 C208 197 225 225 251 254" />
        <path d="M145 178 C166 187 188 185 208 173" />
        <path d="M209 143 C231 145 244 157 249 177" />
        <path d="M231 158 C219 166 209 176 202 190" />
        <path d="M83 260 C119 286 179 288 223 258" />
      `
    case 'museum-half-kneel':
      return `
        <path d="M40 260 L151 260 L161 344" />
        <path d="M34 344 L260 344" />
        <circle cx="104" cy="132" r="25" />
        <circle cx="201" cy="117" r="24" />
        <path d="M102 157 C95 188 79 221 58 260" />
        <path d="M121 158 C142 187 154 220 155 260" />
        <path d="M198 142 C188 175 169 204 139 228" />
        <path d="M208 142 C230 181 235 221 222 262" />
        <path d="M139 203 C164 201 183 197 204 186" />
        <path d="M141 216 C165 220 186 215 207 200" />
        <path d="M221 262 C194 272 174 290 160 344" />
        <path d="M221 262 C248 277 257 304 249 344" />
        <path d="M57 74 C91 50 132 44 169 58" />
      `
    default:
      return `
        <path d="M41 261 L153 261 L163 344" />
        <path d="M35 344 L263 344" />
        <circle cx="105" cy="133" r="25" />
        <circle cx="198" cy="123" r="24" />
        <path d="M102 158 C95 190 80 222 59 261" />
        <path d="M121 158 C143 188 155 220 156 261" />
        <path d="M196 148 C181 174 162 195 136 211" />
        <path d="M207 147 C224 178 228 214 218 253" />
        <path d="M134 195 C154 184 174 181 194 187" />
        <path d="M140 211 C162 214 181 209 202 195" />
        <path d="M217 253 C191 268 174 295 166 344" />
        <path d="M217 253 C240 275 247 306 238 344" />
        <path d="M128 82 C145 70 165 67 184 76" />
      `
  }
}

function getPoseSketchSvg(id: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 380">
    <rect width="300" height="380" fill="#fffaf5"/>
    <path d="M22 344 C88 331 155 331 278 344" fill="none" stroke="#eadfd5" stroke-width="5" stroke-linecap="round"/>
    <g fill="none" stroke="#30343b" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
      ${getPoseSketchBody(id)}
    </g>
    <g fill="none" stroke="#f0a7bd" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9">
      <path d="M86 63 C97 50 112 44 129 45"/>
      <path d="M183 54 C198 46 214 47 229 56"/>
      <path d="M132 69 C142 61 154 60 165 67"/>
    </g>
  </svg>`
}

function svgToDataUrl(svg: string) {
  const encoded = typeof window === 'undefined' ? Buffer.from(svg).toString('base64') : window.btoa(svg)
  return `data:image/svg+xml;base64,${encoded}`
}

function getPoseSketchDataUrl(id: string) {
  return svgToDataUrl(getPoseSketchSvg(id))
}

function renderPoseSketchToPng(id: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new window.Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 900
      canvas.height = 1140
      const context = canvas.getContext('2d')
      if (!context) {
        reject(new Error('Canvas is not available.'))
        return
      }
      context.fillStyle = '#fffaf5'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/png'))
    }
    image.onerror = reject
    image.src = getPoseSketchDataUrl(id)
  })
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
          border: previewUrl ? '2px solid #ef5da8' : '1.5px dashed #d8dee8',
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
              color: '#7b8494',
              fontSize: '13px',
              fontWeight: 700,
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

export default function CouplePhotoGeneratorPage() {
  const [partnerAPreview, setPartnerAPreview] = useState<string | null>(null)
  const [partnerBPreview, setPartnerBPreview] = useState<string | null>(null)
  const partnerARef = useRef<string | null>(null)
  const partnerBRef = useRef<string | null>(null)

  const [poseId, setPoseId] = useState(POSES[0].id)
  const [scene, setScene] = useState(SCENES[0])
  const [mood, setMood] = useState(MOODS[0])
  const [aspectRatio, setAspectRatio] = useState('3:4')
  const [extraPrompt, setExtraPrompt] = useState('')
  const [, setUploadVersion] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [results, setResults] = useState<GeneratedImage[]>([])

  const selectedPose = POSES.find((pose) => pose.id === poseId) || POSES[0]
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
      tool_name: 'couple_photo_generator',
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
    const prompt = buildPrompt(selectedPose, scene, mood, extraPrompt)
    trackEvent('generation_started', {
      tool_name: 'couple_photo_generator',
      pose_id: selectedPose.id,
      aspect_ratio: aspectRatio,
    })

    try {
      const poseReference = await renderPoseSketchToPng(selectedPose.id)
      const response = await fetch('/api/tools/model-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'image',
          model: 'gpt-image-2',
          mode: 'Reference to Image',
          aspectRatio,
          resolution: '1k',
          count: 1,
          style: 'Realistic lifestyle photography',
          creditsCost: 8,
          prompt,
          uploads: [
            { name: 'partner-a.jpg', type: 'image/jpeg', dataURL: partnerARef.current },
            { name: 'partner-b.jpg', type: 'image/jpeg', dataURL: partnerBRef.current },
            { name: `${selectedPose.id}-pose.png`, type: 'image/png', dataURL: poseReference },
          ],
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        setErrorMsg(data.error || 'Generation failed. Please try another pose or photo.')
        trackEvent('generation_failed', {
          tool_name: 'couple_photo_generator',
          pose_id: selectedPose.id,
          status: response.status,
        })
        return
      }

      setResults((current) => [
        {
          id: crypto.randomUUID(),
          imageUrl: data.url,
          poseTitle: selectedPose.title,
          generatedAt: new Date(data.generatedAt),
        },
        ...current,
      ])
      trackEvent('generation_succeeded', {
        tool_name: 'couple_photo_generator',
        pose_id: selectedPose.id,
      })
    } catch (error) {
      console.error('[couple-photo-generator] fetch error:', error)
      setErrorMsg('Network error. Please check your connection and retry.')
      trackEvent('generation_failed', {
        tool_name: 'couple_photo_generator',
        pose_id: selectedPose.id,
        reason: 'network_error',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleDownload(item: GeneratedImage) {
    const response = await fetch(item.imageUrl)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = blobUrl
    anchor.download = `couple-photo-${item.generatedAt.getTime()}.png`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fbfaf8', padding: '32px 32px 80px 48px' }}>
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
            Couple Photo Generator
          </Link>
          <p style={{ maxWidth: '720px', margin: '12px 0 0 28px', color: '#667085', fontSize: '14px', lineHeight: 1.7 }}>
            Upload two partner photos, choose a pose from the local couple pose library, and generate a warm everyday photo with a natural romantic feeling.
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
            aria-label="Couple photo settings"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #ece7e3',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 12px 30px rgba(31, 41, 55, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Camera size={18} color="#ef5da8" />
              <h2 style={{ margin: 0, fontSize: '15px', color: '#26303f' }}>Partner photos</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '22px' }}>
              <UploadSlot
                id="partner-a-upload"
                label="Partner A"
                previewUrl={partnerAPreview}
                onChange={(event) => handleFileChange(event, setPartnerAPreview, partnerARef, 'partner_a')}
              />
              <UploadSlot
                id="partner-b-upload"
                label="Partner B"
                previewUrl={partnerBPreview}
                onChange={(event) => handleFileChange(event, setPartnerBPreview, partnerBRef, 'partner_b')}
              />
            </div>

            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 800, color: '#344054' }}>
              Pose
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
              {POSES.map((pose) => {
                const active = pose.id === poseId
                return (
                  <button
                    key={pose.id}
                    type="button"
                    onClick={() => setPoseId(pose.id)}
                    style={{
                      textAlign: 'left',
                      border: active ? '2px solid #ef5da8' : '1px solid #ebeef3',
                      borderRadius: '8px',
                      padding: 0,
                      backgroundColor: '#ffffff',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        width: '100%',
                        aspectRatio: '4 / 3',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fffaf5',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={getPoseSketchDataUrl(pose.id)}
                        alt={pose.title}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                      />
                    </span>
                    <span style={{ display: 'block', padding: '8px 9px 2px', color: '#1d2939', fontSize: '12px', fontWeight: 800 }}>
                      {pose.title}
                    </span>
                    <span style={{ display: 'block', padding: '0 9px 8px', color: '#7b8494', fontSize: '10px', lineHeight: 1.35 }}>
                      {pose.category}
                    </span>
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '13px', fontWeight: 800, color: '#344054' }}>
                Scene
                <select
                  value={scene}
                  onChange={(event) => setScene(event.target.value)}
                  style={{ height: '40px', border: '1px solid #d7dde7', borderRadius: '8px', padding: '0 10px', backgroundColor: '#ffffff' }}
                >
                  {SCENES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '13px', fontWeight: 800, color: '#344054' }}>
                Mood
                <select
                  value={mood}
                  onChange={(event) => setMood(event.target.value)}
                  style={{ height: '40px', border: '1px solid #d7dde7', borderRadius: '8px', padding: '0 10px', backgroundColor: '#ffffff' }}
                >
                  {MOODS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>

            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 800, color: '#344054' }}>
              Aspect ratio
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '14px' }}>
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  style={{
                    height: '36px',
                    borderRadius: '8px',
                    border: ratio === aspectRatio ? '2px solid #ef5da8' : '1px solid #d7dde7',
                    backgroundColor: ratio === aspectRatio ? '#fff1f7' : '#ffffff',
                    color: '#26303f',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {ratio}
                </button>
              ))}
            </div>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '13px', fontWeight: 800, color: '#344054' }}>
              Extra direction
              <textarea
                value={extraPrompt}
                onChange={(event) => setExtraPrompt(event.target.value)}
                placeholder="Optional: outfits, season, city, camera style..."
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
                backgroundColor: canGenerate ? '#ef5da8' : '#e4e7ec',
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
              {isGenerating ? 'Generating...' : 'Generate Couple Photo'}
            </button>
          </section>

          <section
            aria-label="Generated couple photos"
            style={{
              minHeight: '760px',
              backgroundColor: '#151515',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #242424',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '18px 20px',
                borderBottom: '1px solid #282828',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={17} color="#ff8abf" />
                <h2 style={{ margin: 0, color: '#ffffff', fontSize: '15px' }}>Preview Results</h2>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>{results.length} generated</span>
            </div>

            <div style={{ padding: '18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
              {isGenerating ? (
                <div
                  style={{
                    minHeight: '350px',
                    borderRadius: '8px',
                    background: 'linear-gradient(90deg, #222 25%, #303030 50%, #222 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.4s infinite',
                  }}
                />
              ) : null}

              {results.map((item) => (
                <article key={item.id} style={{ overflow: 'hidden', borderRadius: '8px', backgroundColor: '#202020', border: '1px solid #303030' }}>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: aspectRatio.replace(':', ' / ') }}>
                    <Image src={item.imageUrl} alt={item.poseTitle} fill style={{ objectFit: 'cover' }} unoptimized={item.imageUrl.startsWith('data:')} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px' }}>
                    <div>
                      <div style={{ color: '#ffffff', fontSize: '12px', fontWeight: 800 }}>{item.poseTitle}</div>
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
                  <p style={{ maxWidth: '360px', margin: 0, fontSize: '14px', lineHeight: 1.7 }}>
                    Your generated daily couple photo will appear here after both partner photos are uploaded and a pose is selected.
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
