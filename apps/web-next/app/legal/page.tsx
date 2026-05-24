import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { legalIndex } from './legal-docs'

export const metadata: Metadata = {
  title: 'Legal Center | Dommi',
  description: 'Dommi legal policies, including terms, privacy, refunds, AI content rules, and deletion requests.',
  alternates: {
    canonical: '/legal',
  },
}

export default function LegalPage() {
  return (
    <main style={{ maxWidth: '980px', margin: '0 auto', padding: '72px 32px', color: '#374151' }}>
      <h1 style={{ fontSize: '46px', lineHeight: 1.08, color: '#111827', margin: '0 0 14px' }}>
        Legal center
      </h1>
      <p style={{ fontSize: '18px', lineHeight: 1.65, color: '#64748b', maxWidth: 720, margin: '0 0 34px' }}>
        Review Dommi policies for account use, privacy, payments, AI-generated content, and deletion requests.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {legalIndex.map((doc) => (
          <Link
            key={doc.href}
            href={doc.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 180,
              padding: 22,
              borderRadius: 18,
              border: '1px solid #e5e7eb',
              background: '#fff',
              color: 'inherit',
              textDecoration: 'none',
              boxShadow: '0 18px 45px rgba(15,23,42,0.05)',
            }}
          >
            <div>
              <h2 style={{ margin: 0, color: '#111827', fontSize: 21 }}>{doc.title}</h2>
              <p style={{ margin: '10px 0 0', color: '#64748b', lineHeight: 1.55 }}>{doc.description}</p>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 18, color: '#155dfc', fontWeight: 700 }}>
              Read policy
              <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}
