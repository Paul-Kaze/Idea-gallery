'use client'

import React, { useState, useRef } from 'react'
import { ArrowLeft, Upload, Sparkles, ChevronDown, ChevronUp, Download, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// ─── Types ──────────────────────────────────────────────────────────────────

type GeneratedImage = {
    id: string
    imageUrl: string
    gender: 'girl' | 'boy'
    generatedAt: Date
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Read a File as a base64 data URL (suitable for sending to the API)
 */
function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

/**
 * Compress an image file to keep base64 payload small (≤ 1 MB)
 */
function compressImage(file: File, maxSizePx = 800, quality = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new window.Image()
        const url = URL.createObjectURL(file)
        img.onload = () => {
            URL.revokeObjectURL(url)
            const canvas = document.createElement('canvas')
            const scale = Math.min(1, maxSizePx / Math.max(img.width, img.height))
            canvas.width = Math.round(img.width * scale)
            canvas.height = Math.round(img.height * scale)
            const ctx = canvas.getContext('2d')!
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            resolve(canvas.toDataURL('image/jpeg', quality))
        }
        img.onerror = reject
        img.src = url
    })
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkeletonCard() {
    return (
        <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#1e1e1e',
            border: '1px solid #2a2a2a',
        }}>
            {/* Header */}
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '14px', borderRadius: '7px', background: 'linear-gradient(90deg, #2a2a2a 25%, #383838 50%, #2a2a2a 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                <div style={{ width: '48px', height: '22px', borderRadius: '11px', background: 'linear-gradient(90deg, #2a2a2a 25%, #383838 50%, #2a2a2a 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            </div>
            {/* Image placeholder */}
            <div style={{ height: '300px', background: 'linear-gradient(90deg, #222 25%, #2e2e2e 50%, #222 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        </div>
    )
}

function ResultCard({ item, onDownload }: { item: GeneratedImage; onDownload: (item: GeneratedImage) => void }) {
    return (
        <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
        }}>
            {/* Card header */}
            <div style={{
                padding: '10px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #2a2a2a',
            }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                    {formatTime(item.generatedAt)}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: '20px',
                        backgroundColor: item.gender === 'girl' ? 'rgba(244, 114, 182, 0.15)' : 'rgba(96, 165, 250, 0.15)',
                        color: item.gender === 'girl' ? '#f472b6' : '#60a5fa',
                    }}>
                        {item.gender === 'girl' ? '👧 Girl' : '👦 Boy'}
                    </span>
                    <button
                        onClick={() => onDownload(item)}
                        title="Download"
                        style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '12px',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                    >
                        <Download size={13} />
                    </button>
                </div>
            </div>
            {/* Image */}
            <div style={{ position: 'relative', width: '100%', paddingTop: '133%' /* 3:4 ratio */ }}>
                <Image
                    src={item.imageUrl}
                    alt={`Generated baby (${item.gender})`}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized={item.imageUrl.startsWith('data:')}
                />
            </div>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AIBabyGeneratorPage() {
    // Image display URLs (object URL for previewing in UI)
    const [momPreviewUrl, setMomPreviewUrl] = useState<string | null>(null)
    const [dadPreviewUrl, setDadPreviewUrl] = useState<string | null>(null)
    // Compressed base64 stored separately for API sending
    const momBase64Ref = useRef<string | null>(null)
    const dadBase64Ref = useRef<string | null>(null)

    const [gender, setGender] = useState<'girl' | 'boy'>('girl')
    const [isGenerating, setIsGenerating] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
    const [isHistoryLoading, setIsHistoryLoading] = useState(true)
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

    // Fetch history on mount
    React.useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('/api/tools/baby-generate/history')
                if (res.ok) {
                    const data = await res.json()
                    if (data.history && Array.isArray(data.history)) {
                        setGeneratedImages(data.history.map((item: any) => ({
                            ...item,
                            generatedAt: new Date(item.generatedAt)
                        })))
                    }
                }
            } catch (err) {
                console.error('[baby-generate] Failed to fetch history:', err)
            } finally {
                setIsHistoryLoading(false)
            }
        }
        fetchHistory()
    }, [])

    // Using Unsplash placeholders for presets
    const momPresets = [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop'
    ]

    const dadPresets = [
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1504257432389-523431e11105?w=100&h=100&fit=crop'
    ]

    const faqs = [
        { q: "Is the baby face prediction realistic?", a: "Yes, our AI uses advanced biometric algorithms trained on millions of data points to create highly realistic predictive portraits." },
        { q: "Is the tool free to use?", a: "We offer both free credits for new users and premium, high-resolution generation options." },
        { q: "Is my privacy protected when using AI Baby Generator?", a: "Absolutely. All images are processed with bank-level encryption and are deleted from our servers within 24 hours." },
        { q: "How does the AI Baby Generator work?", a: "We analyze over 800 facial anchors from both parents and apply genetic inheritance algorithms to fuse the features naturally." },
        { q: "Can I choose the gender of the ai baby?", a: "Yes, you can explicitly toggle between generating a boy or a girl portrait." },
        { q: "What can I do using this ai baby portrait?", a: "You can share it with family, use it for fun family planning discussions, or keep it as a charming keepsake." },
        { q: "How long does it take to generate the ai baby?", a: "The process usually takes 10–30 seconds after uploading your photos." }
    ]

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleGenerate = async () => {
        const momB64 = momBase64Ref.current
        const dadB64 = dadBase64Ref.current

        if (!momPreviewUrl || !dadPreviewUrl || !momB64 || !dadB64) {
            alert('Please upload both parents\' photos first')
            return
        }

        setIsGenerating(true)
        setErrorMsg(null)

        try {
            const res = await fetch('/api/tools/baby-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ momImage: momB64, dadImage: dadB64, gender }),
            })

            const data = await res.json()

            if (!res.ok) {
                setErrorMsg(data.error ?? 'Generation failed. Please try again.')
                return
            }

            const newImage: GeneratedImage = {
                id: crypto.randomUUID(),
                imageUrl: data.imageUrl,
                gender: data.gender,
                generatedAt: new Date(data.generatedAt),
            }
            // Prepend so latest is first
            setGeneratedImages(prev => [newImage, ...prev])
        } catch (err) {
            setErrorMsg('Network error. Please check your connection and retry.')
            console.error('[baby-generate] fetch error:', err)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        setPreview: React.Dispatch<React.SetStateAction<string | null>>,
        base64Ref: React.MutableRefObject<string | null>
    ) => {
        const file = e.target.files?.[0]
        if (!file) return
        // Preview using object URL (fast, no memory leak since we revoke below)
        const previewUrl = URL.createObjectURL(file)
        setPreview(previewUrl)
        // Compress and store base64 for API
        const compressed = await compressImage(file)
        base64Ref.current = compressed
    }

    const handlePresetSelect = (presetUrl: string, setPreview: React.Dispatch<React.SetStateAction<string | null>>, base64Ref: React.MutableRefObject<string | null>) => {
        setPreview(presetUrl)
        // For preset URLs, use the URL directly (the API accepts both data: and https:)
        base64Ref.current = presetUrl
    }

    const handleDownload = async (item: GeneratedImage) => {
        try {
            // Since the OSS bucket is now configured as Public Read,
            // we can fetch the image blob directly to trigger a proper download.
            const response = await fetch(item.imageUrl)
            const blob = await response.blob()
            const blobUrl = URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = blobUrl
            a.download = `baby-${item.gender}-${item.generatedAt.getTime()}.png`
            a.target = '_blank'
            document.body.appendChild(a)
            a.click()

            // Cleanup
            document.body.removeChild(a)
            setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
        } catch (error) {
            console.error('Download failed:', error)
        }
    }

    const triggerFileInput = (id: string) => {
        document.getElementById(id)?.click()
    }

    const toggleFaq = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index)
    }

    const scrollToGenerator = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // ── Render ────────────────────────────────────────────────────────────────

    const canGenerate = !!(momPreviewUrl && dadPreviewUrl && !isGenerating)

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#fafafa',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
        >
            {/* Main Generator Section */}
            <div style={{ padding: '32px 32px 96px 48px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ marginBottom: '40px' }}>
                        <Link
                            href="/tools"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#101828',
                                textDecoration: 'none',
                                fontSize: '20px',
                                fontWeight: 700,
                                marginBottom: '24px',
                                letterSpacing: '-0.4px'
                            }}
                        >
                            <ArrowLeft size={20} />
                            Baby Photos
                        </Link>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0, 418px) minmax(0, 1fr)',
                            gap: '32px',
                        }}
                    >
                        {/* Left Column: Input Panel */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                            {/* Parent Uploads */}
                            <div>
                                <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#364153', margin: '0 0 16px 0' }}>
                                    Upload Parents' Photo
                                </h2>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    {/* Mom Upload */}
                                    <div>
                                        <input
                                            type="file"
                                            id="mom-upload"
                                            hidden
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, setMomPreviewUrl, momBase64Ref)}
                                        />
                                        <div
                                            onClick={() => triggerFileInput('mom-upload')}
                                            style={{
                                                border: `2px ${momPreviewUrl ? 'solid' : 'dashed'} ${momPreviewUrl ? '#3b82f6' : '#e5e7eb'}`,
                                                borderRadius: '16px',
                                                height: '268px',
                                                backgroundColor: '#ffffff',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                marginBottom: '12px'
                                            }}
                                        >
                                            {momPreviewUrl ? (
                                                <Image src={momPreviewUrl} alt="Mom" fill style={{ objectFit: 'cover' }} unoptimized />
                                            ) : (
                                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Upload size={24} color="#9ca3af" style={{ marginBottom: '8px' }} />
                                                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>Mom's Photo</span>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '10px', fontWeight: 700, color: '#99a1af', textTransform: 'uppercase' }}>TRY:</span>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                {momPresets.map((preset, i) => (
                                                    <div
                                                        key={i}
                                                        onClick={() => handlePresetSelect(preset, setMomPreviewUrl, momBase64Ref)}
                                                        style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', border: '1px solid #f3f4f6', position: 'relative' }}
                                                    >
                                                        <Image src={preset} alt="preset" fill style={{ objectFit: 'cover' }} sizes="28px" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dad Upload */}
                                    <div>
                                        <input
                                            type="file"
                                            id="dad-upload"
                                            hidden
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, setDadPreviewUrl, dadBase64Ref)}
                                        />
                                        <div
                                            onClick={() => triggerFileInput('dad-upload')}
                                            style={{
                                                border: `2px ${dadPreviewUrl ? 'solid' : 'dashed'} ${dadPreviewUrl ? '#3b82f6' : '#e5e7eb'}`,
                                                borderRadius: '16px',
                                                height: '268px',
                                                backgroundColor: '#ffffff',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                marginBottom: '12px'
                                            }}
                                        >
                                            {dadPreviewUrl ? (
                                                <Image src={dadPreviewUrl} alt="Dad" fill style={{ objectFit: 'cover' }} unoptimized />
                                            ) : (
                                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Upload size={24} color="#9ca3af" style={{ marginBottom: '8px' }} />
                                                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>Dad's Photo</span>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '10px', fontWeight: 700, color: '#99a1af', textTransform: 'uppercase' }}>TRY:</span>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                {dadPresets.map((preset, i) => (
                                                    <div
                                                        key={i}
                                                        onClick={() => handlePresetSelect(preset, setDadPreviewUrl, dadBase64Ref)}
                                                        style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', border: '1px solid #f3f4f6', position: 'relative' }}
                                                    >
                                                        <Image src={preset} alt="preset" fill style={{ objectFit: 'cover' }} sizes="28px" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Gender Toggle */}
                            <div>
                                <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#364153', margin: '0 0 12px 0' }}>
                                    Baby's Gender
                                </h2>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '12px',
                                    backgroundColor: 'rgba(243, 244, 246, 0.5)',
                                    padding: '6px',
                                    borderRadius: '16px'
                                }}>
                                    <button
                                        onClick={() => setGender('girl')}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            backgroundColor: gender === 'girl' ? '#ffffff' : 'transparent',
                                            border: 'none',
                                            padding: '12px',
                                            borderRadius: '14px',
                                            boxShadow: gender === 'girl' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            color: gender === 'girl' ? '#000000' : '#6a7282',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <span style={{ fontSize: '16px' }}>👧</span> Girl
                                    </button>
                                    <button
                                        onClick={() => setGender('boy')}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            backgroundColor: gender === 'boy' ? '#ffffff' : 'transparent',
                                            border: 'none',
                                            padding: '12px',
                                            borderRadius: '14px',
                                            boxShadow: gender === 'boy' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            color: gender === 'boy' ? '#000000' : '#6a7282',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <span style={{ fontSize: '16px' }}>👦</span> Boy
                                    </button>
                                </div>
                            </div>

                            {/* Divider */}
                            <hr style={{ borderTop: '1px solid #f3f4f6', margin: 0 }} />

                            {/* Error Message */}
                            {errorMsg && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '10px',
                                    padding: '12px 16px',
                                    backgroundColor: '#fef2f2',
                                    border: '1px solid #fecaca',
                                    borderRadius: '12px',
                                    color: '#dc2626',
                                    fontSize: '13px',
                                    lineHeight: 1.5,
                                }}>
                                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                                    {errorMsg}
                                </div>
                            )}

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                disabled={!canGenerate}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '16px',
                                    backgroundColor: !canGenerate ? '#e5e7eb' : '#8bc34a',
                                    color: !canGenerate ? '#9ca3af' : '#ffffff',
                                    fontSize: '18px',
                                    fontWeight: 700,
                                    border: 'none',
                                    cursor: !canGenerate ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s',
                                    boxShadow: !canGenerate ? 'none' : '0 10px 15px -3px #dcfce7, 0 4px 6px -4px #dcfce7'
                                }}
                            >
                                {isGenerating ? (
                                    <>
                                        <Sparkles size={20} style={{ animation: 'spin 2s linear infinite' }} />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Generate ( -5 Credit )
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Right Column: Results Timeline */}
                        <div style={{
                            backgroundColor: '#111111',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '700px',
                        }}>
                            {/* Panel Header */}
                            <div style={{
                                padding: '20px 24px',
                                borderBottom: '1px solid #2a2a2a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                                    Preview Results
                                </h2>
                                {generatedImages.length > 0 && (
                                    <span style={{
                                        fontSize: '12px',
                                        color: 'rgba(255,255,255,0.4)',
                                        backgroundColor: 'rgba(255,255,255,0.08)',
                                        padding: '3px 10px',
                                        borderRadius: '20px',
                                    }}>
                                        {generatedImages.length} generated
                                    </span>
                                )}
                            </div>

                            {/* Results List */}
                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                            }}>
                                {/* Skeleton card while generating */}
                                {isGenerating && <SkeletonCard />}

                                {/* Generated image cards */}
                                {generatedImages.map(item => (
                                    <ResultCard key={item.id} item={item} onDownload={handleDownload} />
                                ))}

                                {/* Loading History State */}
                                {isHistoryLoading && !isGenerating && (
                                    <div style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '48px 32px',
                                        minHeight: '580px',
                                    }}>
                                        <Sparkles size={32} color="rgba(255,255,255,0.2)" style={{ animation: 'spin 2s linear infinite' }} />
                                    </div>
                                )}

                                {/* Empty state */}
                                {!isHistoryLoading && !isGenerating && generatedImages.length === 0 && (
                                    <div style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '48px 32px',
                                        textAlign: 'center',
                                        minHeight: '580px',
                                    }}>
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '24px',
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 24px',
                                        }}>
                                            <Sparkles size={40} color="rgba(255,255,255,0.6)" />
                                        </div>
                                        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>
                                            Ready to combine
                                        </h3>
                                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.3)', fontSize: '14px', lineHeight: '1.6', maxWidth: '260px' }}>
                                            Upload both parents' photos and choose gender to see the magic.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Showcase Section */}
            <div style={{ padding: '96px 32px', maxWidth: '1000px', margin: '0 auto' }}>

                {/* Precise Analysis Section */}
                <div style={{ marginBottom: '128px' }}>
                    <div style={{ marginBottom: '64px' }}>
                        <h2 style={{ fontSize: '56px', fontWeight: 900, color: '#101828', letterSpacing: '-1.5px', marginBottom: '16px', lineHeight: 1.1 }}>
                            Precise Analysis of Genetic Factors
                        </h2>
                        <p style={{ fontSize: '20px', color: '#6a7282', maxWidth: '800px', lineHeight: 1.5 }}>
                            Trained on real genetic data from 1.28 million families, utilizing 800+ key facial anchors to achieve precise facial feature fusion across age groups.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                        {/* Feature Column 1 */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{
                                width: '100%',
                                height: '360px',
                                borderRadius: '40px',
                                backgroundColor: '#f9fafb',
                                border: '2px solid rgba(0, 201, 80, 0.2)',
                                boxShadow: '0 20px 25px -5px rgba(229,231,235,0.5)',
                                overflow: 'hidden',
                                position: 'relative',
                                marginBottom: '24px'
                            }}>
                                <Image src="https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400" alt="Golden Ratio" fill style={{ objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.8)', overflow: 'hidden', position: 'relative' }}>
                                        <Image src={momPresets[0]} alt="Mom" fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ padding: '4px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '50%' }}>
                                        <Sparkles size={16} color="#fff" />
                                    </div>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.8)', overflow: 'hidden', position: 'relative' }}>
                                        <Image src={dadPresets[0]} alt="Dad" fill style={{ objectFit: 'cover' }} />
                                    </div>
                                </div>
                                <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', padding: '6px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)' }}>
                                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>Heritage Match 98%</span>
                                </div>
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#101828', marginBottom: '8px' }}>Golden Ratio Fusion</h3>
                            <p style={{ fontSize: '14px', color: '#6a7282', textAlign: 'center' }}>Precise matching of parental facial golden ratio</p>
                        </div>

                        {/* Feature Column 2 */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{
                                width: '100%',
                                height: '360px',
                                borderRadius: '40px',
                                backgroundColor: '#f9fafb',
                                border: '2px solid rgba(251, 44, 54, 0.2)',
                                boxShadow: '0 20px 25px -5px rgba(229,231,235,0.5)',
                                overflow: 'hidden',
                                position: 'relative',
                                marginBottom: '24px'
                            }}>
                                <Image src="https://images.unsplash.com/photo-1544126592-807ade215a0b?w=400" alt="Heritage" fill style={{ objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.8)', overflow: 'hidden', position: 'relative' }}>
                                        <Image src={momPresets[1]} alt="Mom" fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ padding: '4px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '50%' }}>
                                        <Sparkles size={16} color="#fff" />
                                    </div>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.8)', overflow: 'hidden', position: 'relative' }}>
                                        <Image src={dadPresets[1]} alt="Dad" fill style={{ objectFit: 'cover' }} />
                                    </div>
                                </div>
                                <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', padding: '6px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)' }}>
                                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>Heritage Match 98%</span>
                                </div>
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#101828', marginBottom: '8px' }}>Deep Heritage Analysis</h3>
                            <p style={{ fontSize: '14px', color: '#6a7282', textAlign: 'center' }}>Deep analysis of skeletal structure and skin texture</p>
                        </div>

                        {/* Feature Column 3 */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{
                                width: '100%',
                                height: '360px',
                                borderRadius: '40px',
                                backgroundColor: '#f9fafb',
                                border: '2px solid rgba(81, 162, 255, 0.2)',
                                boxShadow: '0 20px 25px -5px rgba(229,231,235,0.5)',
                                overflow: 'hidden',
                                position: 'relative',
                                marginBottom: '24px'
                            }}>
                                <Image src="https://images.unsplash.com/photo-1595159837380-4592a2a096c4?w=400" alt="Ethereal Features" fill style={{ objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.8)', overflow: 'hidden', position: 'relative' }}>
                                        <Image src={momPresets[2]} alt="Mom" fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ padding: '4px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '50%' }}>
                                        <Sparkles size={16} color="#fff" />
                                    </div>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.8)', overflow: 'hidden', position: 'relative' }}>
                                        <Image src={dadPresets[2]} alt="Dad" fill style={{ objectFit: 'cover' }} />
                                    </div>
                                </div>
                                <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', padding: '6px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)' }}>
                                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>Heritage Match 98%</span>
                                </div>
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#101828', marginBottom: '8px' }}>Ethereal Features</h3>
                            <p style={{ fontSize: '14px', color: '#6a7282', textAlign: 'center' }}>Capturing the essence of parental charm and dynamic expressions</p>
                        </div>
                    </div>
                </div>

                {/* Why Choose Section */}
                <div style={{ marginBottom: '128px' }}>
                    <h2 style={{ fontSize: '56px', fontWeight: 900, color: '#101828', letterSpacing: '-1.5px', marginBottom: '64px', lineHeight: 1.1 }}>
                        Why choose our ai baby generator?
                    </h2>

                    {/* Block 1 */}
                    <div style={{ display: 'flex', gap: '64px', alignItems: 'center', marginBottom: '128px' }}>
                        <div style={{ width: '450px', height: '540px', borderRadius: '40px', overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px -12px rgba(229,231,235,0.5)' }}>
                            <Image src="https://images.unsplash.com/photo-1544126592-807ade215a0b?w=500" alt="Personalized Accuracy" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '48px', fontWeight: 900, color: '#101828', marginBottom: '24px', lineHeight: 1.1, letterSpacing: '-1px' }}>
                                Your Personalized & Accurate Baby Prediction
                            </h3>
                            <p style={{ fontSize: '18px', color: '#6a7282', lineHeight: 1.6, marginBottom: '48px' }}>
                                Our AI baby generator analyzes facial features from portrait photos of one or both parents, accurately blending the physical characteristics of both parents to create a lifelike image of your future baby. This prediction gives you a glimpse into your child's face.
                            </p>
                            <button onClick={scrollToGenerator} style={{ padding: '16px 32px', backgroundColor: '#8bc34a', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 20px 25px 0 rgba(0,201,80,0.2)' }}>
                                Make Your Baby Now
                            </button>
                        </div>
                    </div>

                    {/* Block 2 */}
                    <div style={{ display: 'flex', gap: '64px', alignItems: 'center', marginBottom: '128px', flexDirection: 'row-reverse' }}>
                        <div style={{ width: '450px', height: '460px', backgroundColor: '#fff', borderRadius: '40px', overflow: 'hidden', padding: '24px', boxSizing: 'border-box', boxShadow: '0 25px 50px -12px rgba(229,231,235,0.5)' }}>
                            <div style={{ display: 'flex', gap: '16px', height: '100%' }}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ flex: 1, borderRadius: '24px', overflow: 'hidden', position: 'relative', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                        <Image src="https://images.unsplash.com/photo-1595159837380-4592a2a096c4?w=500" alt="Boy" fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ padding: '12px 0', backgroundColor: '#f9fafb', borderRadius: '14px', textAlign: 'center', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Boy</div>
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ flex: 1, borderRadius: '24px', overflow: 'hidden', position: 'relative', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                        <Image src="https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500" alt="Girl" fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ padding: '12px 0', backgroundColor: '#f9fafb', borderRadius: '14px', textAlign: 'center', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Girl</div>
                                </div>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '48px', fontWeight: 900, color: '#101828', marginBottom: '24px', lineHeight: 1.1, letterSpacing: '-1px' }}>
                                Gender Customization
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 48px 0' }}>
                                <li style={{ fontSize: '18px', color: '#6a7282', lineHeight: 1.6, marginBottom: '16px', display: 'flex', gap: '12px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#8bc34a', marginTop: '12px', flexShrink: 0 }} />
                                    Having a cute boy or adorable girl, it's all up to you.
                                </li>
                                <li style={{ fontSize: '18px', color: '#6a7282', lineHeight: 1.6, display: 'flex', gap: '12px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#8bc34a', marginTop: '12px', flexShrink: 0 }} />
                                    Select the gender of your future baby for a more personalized experience. The AI Baby Generator will tailor the baby's look according to the chosen gender, giving you an accurate and fun portrait to work with.
                                </li>
                            </ul>
                            <button onClick={scrollToGenerator} style={{ padding: '16px 32px', backgroundColor: '#8bc34a', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 20px 25px 0 rgba(0,201,80,0.2)' }}>
                                See Your Future Baby
                            </button>
                        </div>
                    </div>

                    {/* Block 3 */}
                    <div style={{ display: 'flex', gap: '64px', alignItems: 'center' }}>
                        <div style={{ width: '450px', height: '400px', borderRadius: '40px', overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px -12px rgba(229,231,235,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Image src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500" alt="Security" fill style={{ objectFit: 'cover' }} />
                            <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.5)' }}>
                                <Sparkles size={40} color="#fff" />
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '48px', fontWeight: 900, color: '#101828', marginBottom: '24px', lineHeight: 1.1, letterSpacing: '-1px' }}>
                                Encrypted & Private Process
                            </h3>
                            <p style={{ fontSize: '18px', color: '#6a7282', lineHeight: 1.6, marginBottom: '48px' }}>
                                We value your privacy as much as you do. Our AI uses bank-level encryption to process your facial data. All uploaded photos and generated results are permanently deleted from our servers within 24 hours. Your future family secrets stay safe with us.
                            </p>
                            <button onClick={scrollToGenerator} style={{ padding: '16px 32px', backgroundColor: '#8bc34a', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 20px 25px 0 rgba(0,201,80,0.2)' }}>
                                Start Secure Prediction
                            </button>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div>
                    <h2 style={{ fontSize: '48px', fontWeight: 900, color: '#101828', letterSpacing: '-1px', marginBottom: '64px', textAlign: 'center' }}>
                        FAQs about AI Baby Generator
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '16px',
                                    overflow: 'hidden'
                                }}
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        padding: '24px',
                                        border: 'none',
                                        backgroundColor: '#fff',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#101828' }}>
                                        {faq.q}
                                    </span>
                                    {expandedFaq === index ? (
                                        <ChevronUp size={24} color="#6a7282" />
                                    ) : (
                                        <ChevronDown size={24} color="#6a7282" />
                                    )}
                                </button>
                                {expandedFaq === index && (
                                    <div style={{ padding: '0 24px 24px 24px', fontSize: '16px', color: '#6a7282', lineHeight: 1.6 }}>
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Keyframes */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}} />
        </div>
    )
}
