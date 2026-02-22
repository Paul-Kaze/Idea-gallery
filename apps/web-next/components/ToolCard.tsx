'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'
import Image from 'next/image'

export interface Tool {
    id: string
    name: string
    description: string
    imageUrl: string
    href?: string
}

interface ToolCardProps {
    tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
    return (
        <div
            style={{
                backgroundColor: '#ffffff',
                border: '1px solid #f3f4f6',
                borderRadius: '14px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)'
                el.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = 'none'
                el.style.transform = 'translateY(0)'
            }}
        >
            {/* Cover Image */}
            <div
                style={{
                    width: '100%',
                    height: '168px',
                    backgroundColor: '#f9fafb',
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0,
                }}
            >
                <Image
                    src={tool.imageUrl}
                    alt={tool.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
            </div>

            {/* Content */}
            <div
                style={{
                    padding: '16px 16px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    flex: 1,
                }}
            >
                {/* Title row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles
                        size={14}
                        style={{ color: '#f59e0b', flexShrink: 0 }}
                        fill="#f59e0b"
                    />
                    <span
                        style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#101828',
                            letterSpacing: '-0.15px',
                            lineHeight: '17.5px',
                        }}
                    >
                        {tool.name}
                    </span>
                </div>

                {/* Description */}
                <p
                    style={{
                        fontSize: '11px',
                        fontWeight: 400,
                        color: '#6a7282',
                        lineHeight: '15.125px',
                        letterSpacing: '0.06px',
                        margin: 0,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const,
                    }}
                >
                    {tool.description}
                </p>

                {/* Try Now Button */}
                <button
                    style={{
                        marginTop: '6px',
                        width: '100%',
                        height: '33px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #f3f4f6',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#101828',
                        letterSpacing: '0.12px',
                        lineHeight: '15px',
                        transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f3f4f6'
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f9fafb'
                    }}
                    onClick={() => {
                        if (tool.href) window.location.href = tool.href
                    }}
                >
                    Try Now
                </button>
            </div>
        </div>
    )
}
