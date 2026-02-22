'use client'

import React, { useState } from 'react'
import { ArrowLeft, Upload, RefreshCw, User, Image as ImageIcon, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function BabyPhotosPage() {
    const [referenceImage, setReferenceImage] = useState<string | null>(null)
    const [promptText, setPromptText] = useState('')
    const [selectedAge, setSelectedAge] = useState<string>('Newborn')
    const [selectedStyle, setSelectedStyle] = useState<string>('Realistic')
    const [isGenerating, setIsGenerating] = useState(false)
    const [resultVideo, setResultVideo] = useState<string | null>(null)

    // Using Unsplash placeholders to match the design aesthetics (since Figma assets are localhost only)
    const agents = [
        { id: 'Newborn', label: 'Newborn', imgSrc: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=200&h=200&fit=crop' },
        { id: 'Toddler', label: 'Toddler', imgSrc: 'https://images.unsplash.com/photo-1587522538165-fbe0d5885060?w=200&h=200&fit=crop' },
        { id: 'Child', label: 'Child', imgSrc: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=200&h=200&fit=crop' },
        { id: 'Teen', label: 'Teen', imgSrc: 'https://images.unsplash.com/photo-1498644445831-29177a45fc4f?w=200&h=200&fit=crop' },
        { id: 'Adult', label: 'Adult', imgSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' }
    ]

    const styles = [
        { id: 'Realistic', label: 'Realistic', imgSrc: 'https://images.unsplash.com/photo-1492681290082-e932832941e6?w=200&h=300&fit=crop' },
        { id: 'Cartoon', label: 'Cartoon', imgSrc: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=200&h=300&fit=crop' },
        { id: '3D Render', label: '3D Render', imgSrc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=300&fit=crop' },
        { id: 'Painting', label: 'Painting', imgSrc: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&h=300&fit=crop' },
        { id: 'Anime', label: 'Anime', imgSrc: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&h=300&fit=crop' }
    ]

    const suggestions = [
        "A cute baby playing with a golden retriever",
        "Futuristic baby with glowing eyes",
        "Baby astronaut floating in space"
    ]

    const handleGenerate = () => {
        setIsGenerating(true)
        // Simulate API call
        setTimeout(() => {
            setIsGenerating(false)
            setResultVideo('sample')
        }, 2000)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setReferenceImage(url)
        }
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#fafafa',
                padding: '32px 32px 32px 48px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
        >
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '40px' }}>
                    <Link
                        href="/tools"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#6a7282',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: 500,
                            marginBottom: '24px',
                            transition: 'color 0.2s ease'
                        }}
                    >
                        <ArrowLeft size={16} />
                        Back to Tools
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: '#101828', // Placeholder logo color
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Sparkles size={20} color="#ffffff" />
                        </div>
                        <h1
                            style={{
                                fontSize: '24px',
                                fontWeight: 800,
                                color: '#101828',
                                letterSpacing: '-0.5px',
                                margin: 0,
                            }}
                        >
                            Baby Photos Simulator
                        </h1>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: '32px',
                        alignItems: 'flex-start'
                    }}
                >
                    {/* Left Column: Input Panel */}
                    <div style={{
                        width: '640px',
                        flexShrink: 0,
                        backgroundColor: '#ffffff',
                        borderRadius: '24px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #f3f4f6',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '32px'
                    }}>

                        {/* Reference Image */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#101828', marginBottom: '8px' }}>
                                Reference Image
                            </label>
                            <input
                                type="file"
                                id="reference-upload"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <div
                                onClick={() => document.getElementById('reference-upload')?.click()}
                                style={{
                                    border: `2px ${referenceImage ? 'solid' : 'dashed'} ${referenceImage ? '#3b82f6' : '#e5e7eb'}`,
                                    borderRadius: '16px',
                                    height: '152px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: referenceImage ? '#eff6ff' : '#fcfcfd',
                                    transition: 'all 0.2s',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {referenceImage ? (
                                    <Image src={referenceImage} alt="Reference" fill style={{ objectFit: 'contain' }} />
                                ) : (
                                    <>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                                            <Upload size={20} color="#6b7280" />
                                        </div>
                                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#101828' }}>Click to upload image</span>
                                        <span style={{ fontSize: '12px', color: '#6a7282', marginTop: '4px' }}>PNG, JPG up to 10MB</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Video Description */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#101828', marginBottom: '8px' }}>
                                Description Prompt
                            </label>
                            <div style={{ position: 'relative' }}>
                                <textarea
                                    value={promptText}
                                    onChange={(e) => setPromptText(e.target.value)}
                                    placeholder="Describe the baby video you want to generate..."
                                    style={{
                                        width: '100%',
                                        height: '100px',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                        resize: 'none',
                                        fontSize: '14px',
                                        color: '#374151',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <span style={{ position: 'absolute', bottom: '12px', right: '12px', fontSize: '12px', color: '#9ca3af' }}>
                                    {promptText.length} / 4000
                                </span>
                            </div>
                        </div>

                        {/* Suggestions */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#6a7282', letterSpacing: '0.6px', textTransform: 'uppercase' }}>Suggestions</span>
                                <button style={{ background: 'none', border: 'none', fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                    <RefreshCw size={14} /> Refresh
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {suggestions.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setPromptText(s)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            border: '1px solid #f3f4f6',
                                            backgroundColor: '#ffffff',
                                            fontSize: '12px',
                                            color: '#4b5563',
                                            cursor: 'pointer',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <hr style={{ borderTop: '1px solid #f3f4f6', margin: 0 }} />

                        {/* Agent Group (Age) */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#101828', marginBottom: '16px' }}>
                                Agent Group (Age)
                            </label>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                {agents.map(agent => (
                                    <div
                                        key={agent.id}
                                        onClick={() => setSelectedAge(agent.id)}
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1 }}
                                    >
                                        <div style={{
                                            width: '100px',
                                            height: '100px',
                                            padding: '4px',
                                            borderRadius: '50%',
                                            border: `2px solid ${selectedAge === agent.id ? '#101828' : 'transparent'}`,
                                            transition: 'border-color 0.2s'
                                        }}>
                                            <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
                                                <Image src={agent.imgSrc} alt={agent.label} fill style={{ objectFit: 'cover' }} sizes="100px" />
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '13px', fontWeight: selectedAge === agent.id ? 700 : 500, color: selectedAge === agent.id ? '#101828' : '#6b7280' }}>
                                            {agent.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Image Style */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#101828', marginBottom: '16px' }}>
                                Image Style
                            </label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {styles.map(style => (
                                    <div
                                        key={style.id}
                                        onClick={() => setSelectedStyle(style.id)}
                                        style={{
                                            flex: 1,
                                            height: '140px',
                                            position: 'relative',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            border: `2px solid ${selectedStyle === style.id ? '#101828' : 'transparent'}`,
                                            padding: '2px'
                                        }}
                                    >
                                        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                                            <Image src={style.imgSrc} alt={style.label} fill style={{ objectFit: 'cover' }} sizes="120px" />
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                                            <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                                                <div style={{ fontSize: '10px', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '2px' }}>Style</div>
                                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>{style.label}</div>
                                            </div>
                                            {selectedStyle === style.id && (
                                                <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#101828' }} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr style={{ borderTop: '1px solid #f3f4f6', margin: 0 }} />

                        {/* Generate Section */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                                <span style={{ color: '#4b5563', fontWeight: 500 }}>Cost:</span>
                                <span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px', fontWeight: 700, color: '#101828' }}>
                                    90 Credits
                                </span>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                style={{
                                    width: '400px',
                                    padding: '16px',
                                    borderRadius: '14px',
                                    backgroundColor: isGenerating ? '#374151' : '#111827',
                                    color: '#ffffff',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: isGenerating ? 'wait' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 10px 15px -3px rgba(17,24,39,0.2)'
                                }}
                            >
                                {isGenerating ? (
                                    <>
                                        <Sparkles size={20} style={{ animation: 'spin 2s linear infinite' }} />
                                        Generating Scene...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Generate Video
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Result Panel */}
                    <div style={{
                        flex: 1,
                        backgroundColor: '#ffffff',
                        borderRadius: '24px',
                        padding: '32px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #f3f4f6',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '865px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#111827' }}>
                                Preview
                            </h2>
                            <span style={{ fontSize: '12px', color: '#6b7280', border: '1px solid #e5e7eb', padding: '4px 8px', borderRadius: '6px' }}>
                                Watermarked Preview
                            </span>
                        </div>

                        <div style={{
                            flex: 1,
                            borderRadius: '16px',
                            backgroundColor: '#fafafa',
                            border: '1px solid #f3f4f6',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            {resultVideo ? (
                                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                    <Image
                                        src="https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80"
                                        alt="Generated Preview"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                    {/* Overlay details */}
                                    <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', background: 'rgba(255,255,255,0.9)', padding: '16px', borderRadius: '12px', backdropFilter: 'blur(8px)' }}>
                                        <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600 }}>Sample: Baby Video Simulator</h3>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>A preview of what the generated video might look like based on similar prompts.</p>
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    color: '#9ca3af'
                                }}>
                                    <ImageIcon size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                                    <p style={{ margin: 0, fontSize: '15px' }}>Configure settings and click generate</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Adding spinning keyframes */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}} />
        </div>
    )
}
