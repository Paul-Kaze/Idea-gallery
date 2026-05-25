import React from 'react'
import { ToolCard } from '../../components/ToolCard'
import type { Tool } from '../../components/ToolCard'

const tools: Tool[] = [
    {
        id: 'ai-baby-generator',
        name: 'AI Baby Generator',
        description: 'See what your future child might look like with our advanced AI face blending technology.',
        imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600',
        href: '/tools/ai-baby-generator',
    },
    {
        id: 'baby-photos',
        name: 'Baby Photos',
        description: 'Generate baby videos from reference images with customizable age and styles.',
        imageUrl: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600',
        href: '/tools/baby-photos',
    },
    {
        id: 'couple-photo-generator',
        name: 'Couple Photo Generator',
        description: 'Upload two partner photos, choose a romantic pose, and create natural daily couple photos.',
        imageUrl: '/couple-photo-generator/showcase.png',
        href: '/tools/couple-photo-generator',
    },
    {
        id: 'couple-nine-grid-generator',
        name: 'Couple Nine-Grid Generator',
        description: 'Create one share-ready 3x3 couple photo story from two partner portraits.',
        imageUrl: '/couple-photo-generator/showcase.png',
        href: '/tools/couple-nine-grid-generator',
    },
]

export default function ToolsPage() {
    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#fafafa',
                padding: '32px 32px 32px 48px',
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Page Header */}
                <div style={{ marginBottom: '40px' }}>
                    <h1
                        style={{
                            fontSize: '30px',
                            fontWeight: 900,
                            color: '#101828',
                            letterSpacing: '0.4px',
                            lineHeight: '36px',
                            margin: 0,
                        }}
                    >
                        Creative Tools
                    </h1>
                </div>

                {/* Tools Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '32px',
                    }}
                >
                    {tools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))}
                </div>
            </div>
        </div>
    )
}
