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
                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
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
