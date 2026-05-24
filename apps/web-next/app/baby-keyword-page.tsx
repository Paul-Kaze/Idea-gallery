import Link from 'next/link'
import { ArrowRight, Baby, ImageIcon, ShieldCheck } from 'lucide-react'

const keywordLinks = [
  { label: 'AI Baby Generator', href: '/ai-baby-generator' },
  { label: 'Future Baby Generator', href: '/future-baby-generator' },
  { label: 'Baby AI Generator Free', href: '/baby-ai-generator-free' },
  { label: 'AI Baby Face Generator Free', href: '/ai-baby-face-generator-free' },
  { label: 'What Will My Baby Look Like?', href: '/what-will-my-baby-look-like' },
]

type BabyKeywordPageProps = {
  title: string
  intro: string
  intent: string
}

export function BabyKeywordPage({ title, intro, intent }: BabyKeywordPageProps) {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '76px 28px 42px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 54, lineHeight: 1.05, letterSpacing: 0 }}>
          {title}
        </h1>
        <p style={{ maxWidth: 760, margin: '20px auto 0', color: '#5b6677', fontSize: 19, lineHeight: 1.7 }}>
          {intro}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginTop: 30 }}>
          <Link
            href="/tools/ai-baby-generator"
            data-analytics-event="cta_clicked"
            data-analytics-location="baby_keyword_hero"
            data-analytics-label="Open generator"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              minHeight: 52,
              padding: '0 24px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, #348dff, #9b35ff)',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 800,
              boxShadow: '0 14px 32px rgba(37,99,235,0.22)',
            }}
          >
            Open generator
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/ai-baby-generator"
            data-analytics-event="internal_link_clicked"
            data-analytics-location="baby_keyword_hero"
            data-analytics-label="Read main guide"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 52,
              padding: '0 24px',
              borderRadius: 999,
              background: '#fff',
              color: '#111827',
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              fontWeight: 800,
            }}
          >
            Read main guide
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 28px 78px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16, marginBottom: 26 }}>
          {[
            { icon: Baby, title: 'Creative preview', body: 'Treat every result as a playful AI image, not a medical or genetic forecast.' },
            { icon: ImageIcon, title: 'Two-photo flow', body: 'Use clear parent portraits so the generator has useful visual references.' },
            { icon: ShieldCheck, title: 'Clear handling', body: 'Generated results may be saved to account history for later viewing or download.' },
          ].map((item) => (
            <article key={item.title} style={{ padding: 22, borderRadius: 18, background: '#fff', border: '1px solid #e5e7eb' }}>
              <item.icon size={24} color="#2563eb" />
              <h2 style={{ margin: '14px 0 8px', fontSize: 20 }}>{item.title}</h2>
              <p style={{ margin: 0, color: '#64748b', lineHeight: 1.6 }}>{item.body}</p>
            </article>
          ))}
        </div>

        <div style={{ padding: 26, borderRadius: 20, background: '#fff', border: '1px solid #e5e7eb' }}>
          <h2 style={{ margin: '0 0 10px', fontSize: 28 }}>Best page for this search intent</h2>
          <p style={{ margin: '0 0 20px', color: '#64748b', lineHeight: 1.7 }}>{intent}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {keywordLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-analytics-event="internal_link_clicked"
                data-analytics-location="baby_keyword_related"
                data-analytics-label={link.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '16px 18px',
                  borderRadius: 14,
                  background: '#f8fafc',
                  color: '#111827',
                  textDecoration: 'none',
                  fontWeight: 750,
                }}
              >
                {link.label}
                <ArrowRight size={16} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
