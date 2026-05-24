import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ImageIcon, Sparkles, Video } from 'lucide-react'
import { MODEL_INDEX_ITEMS } from './model-data'
import { getAbsoluteUrl } from '../../lib/site'

export const metadata: Metadata = {
  title: 'AI Video Models and Tool Alternatives | Dommi',
  description: 'Browse Dommi model and AI video tool landing pages for video generation, image generation, avatar tools, prompt workflows, and brand alternatives.',
  alternates: {
    canonical: '/m',
  },
  openGraph: {
    title: 'AI Video Models and Tool Alternatives | Dommi',
    description: 'Browse AI video, image, and tool brand pages on Dommi.',
    url: '/m',
  },
}

function buildModelIndexJsonLd() {
  const canonicalUrl = getAbsoluteUrl('/m')

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#webpage`,
        name: 'AI Video Models and Tool Alternatives',
        url: canonicalUrl,
        description: metadata.description,
        isPartOf: {
          '@type': 'WebSite',
          name: 'Dommi',
          url: getAbsoluteUrl('/'),
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${canonicalUrl}#models`,
        name: 'Dommi AI model and tool pages',
        itemListElement: MODEL_INDEX_ITEMS.map((model, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: model.name,
          url: getAbsoluteUrl(model.href),
        })),
      },
    ],
  }
}

export default function ModelIndexPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fb', color: '#111827' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildModelIndexJsonLd()) }}
      />
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 24px 48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#2563eb', fontWeight: 700, marginBottom: 18 }}>
          <Sparkles size={18} />
          AI model library
        </div>
        <h1 style={{ margin: 0, maxWidth: 760, fontSize: 56, lineHeight: 1.02, letterSpacing: 0, color: '#0f172a' }}>
          Compare AI models and start creating with Dommi
        </h1>
        <p style={{ maxWidth: 720, margin: '22px 0 0', fontSize: 20, lineHeight: 1.65, color: '#4b5563' }}>
          Explore model-specific pages with prompt examples, use cases, creator references, and direct generator entry points.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
          <Link
            href="/tools"
            data-analytics-event="internal_link_clicked"
            data-analytics-location="model_index_header"
            data-analytics-label="Browse tools"
            style={{ color: '#155dfc', fontWeight: 800, textDecoration: 'none' }}
          >
            Browse tools
          </Link>
          <Link
            href="/ai-baby-generator"
            data-analytics-event="internal_link_clicked"
            data-analytics-location="model_index_header"
            data-analytics-label="AI Baby Generator"
            style={{ color: '#155dfc', fontWeight: 800, textDecoration: 'none' }}
          >
            AI Baby Generator
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px 88px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 18,
          }}
        >
          {MODEL_INDEX_ITEMS.map((model) => {
            const Icon = model.category === 'image' ? ImageIcon : Video
            return (
              <Link
                key={model.href}
                href={model.href}
                data-analytics-event="internal_link_clicked"
                data-analytics-location="model_index_grid"
                data-analytics-label={model.name}
                style={{
                  display: 'flex',
                  minHeight: 210,
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 22,
                  padding: 24,
                  border: '1px solid #e5e7eb',
                  borderRadius: 18,
                  background: '#fff',
                  color: 'inherit',
                  textDecoration: 'none',
                  boxShadow: '0 18px 50px rgba(15,23,42,0.06)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 18 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 14, fontWeight: 700 }}>
                      <Icon size={18} />
                      {model.category === 'image' ? 'Image model' : 'Video model'}
                    </span>
                    <ArrowRight size={18} color="#2563eb" />
                  </div>
                  <h2 style={{ margin: 0, fontSize: 24, lineHeight: 1.15, color: '#0f172a' }}>
                    {model.name}
                  </h2>
                  <p style={{ margin: '12px 0 0', fontSize: 15, lineHeight: 1.55, color: '#5b6677' }}>
                    {model.description}
                  </p>
                </div>
                <span style={{ fontSize: 14, color: '#2563eb', fontWeight: 800 }}>{model.vendor}</span>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
