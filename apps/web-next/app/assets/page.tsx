'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'
import { Download, ImageIcon, Plus, RefreshCw } from 'lucide-react'

type AssetItem = {
  id: string
  imageUrl: string
  gender?: 'girl' | 'boy'
  generatedAt: string
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export default function AssetsPage() {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<AssetItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadHistory() {
      if (status === 'loading') return
      if (!session?.user?.email) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const res = await fetch('/api/tools/baby-generate/history', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) setItems(data.history || [])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadHistory()
    return () => {
      cancelled = true
    }
  }, [session?.user?.email, status])

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '56px 32px 72px 48px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <span style={{ color: '#2563eb', fontWeight: 700, fontSize: 14 }}>Assets</span>
            <h1 style={{ margin: '8px 0 10px', fontSize: 44, lineHeight: 1.05, color: '#0f172a' }}>
              Your generation history
            </h1>
            <p style={{ margin: 0, maxWidth: 660, color: '#64748b', fontSize: 17, lineHeight: 1.65 }}>
              Review and download AI baby previews saved to your Dommi account history.
            </p>
          </div>
          <Link
            href="/tools/ai-baby-generator"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              minHeight: 44,
              padding: '0 18px',
              borderRadius: 12,
              background: '#111827',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            <Plus size={18} />
            Create new
          </Link>
        </header>

        {status !== 'loading' && !session?.user?.email ? (
          <section style={{ padding: 36, borderRadius: 22, background: '#fff', border: '1px solid #e5e7eb', textAlign: 'center' }}>
            <ImageIcon size={34} color="#94a3b8" />
            <h2 style={{ color: '#111827', margin: '14px 0 8px' }}>Sign in to view your assets</h2>
            <p style={{ color: '#64748b', margin: '0 auto 22px', maxWidth: 520 }}>
              Your generated images are tied to your account, so sign in before viewing or downloading history.
            </p>
            <button
              onClick={() => signIn('google')}
              style={{
                height: 44,
                padding: '0 22px',
                border: 0,
                borderRadius: 12,
                background: '#155dfc',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Sign in
            </button>
          </section>
        ) : loading ? (
          <section style={{ padding: 36, borderRadius: 22, background: '#fff', border: '1px solid #e5e7eb', textAlign: 'center' }}>
            <RefreshCw size={28} color="#2563eb" style={{ animation: 'spin 1.2s linear infinite' }} />
            <p style={{ color: '#64748b', marginTop: 14 }}>Loading assets...</p>
          </section>
        ) : items.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 18 }}>
            {items.map((item) => (
              <article key={item.id} style={{ overflow: 'hidden', borderRadius: 18, border: '1px solid #e5e7eb', background: '#fff', boxShadow: '0 18px 45px rgba(15,23,42,0.06)' }}>
                <div style={{ position: 'relative', aspectRatio: '3 / 4', background: '#f1f5f9' }}>
                  <Image
                    src={item.imageUrl}
                    alt="Generated AI baby preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 260px"
                    style={{ objectFit: 'cover' }}
                    unoptimized={item.imageUrl.startsWith('data:')}
                  />
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                    <div>
                      <h2 style={{ margin: 0, color: '#111827', fontSize: 16 }}>
                        AI Baby Preview
                      </h2>
                      <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 12 }}>
                        {formatDate(item.generatedAt)}
                      </p>
                    </div>
                    <a
                      href={item.imageUrl}
                      download
                      target="_blank"
                      rel="noreferrer"
                      title="Download image"
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#eff6ff',
                        color: '#2563eb',
                      }}
                    >
                      <Download size={18} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section style={{ padding: 36, borderRadius: 22, background: '#fff', border: '1px solid #e5e7eb', textAlign: 'center' }}>
            <ImageIcon size={34} color="#94a3b8" />
            <h2 style={{ color: '#111827', margin: '14px 0 8px' }}>No assets yet</h2>
            <p style={{ color: '#64748b', margin: '0 auto 22px', maxWidth: 520 }}>
              Generate your first AI baby preview and it will appear here.
            </p>
            <Link href="/tools/ai-baby-generator" style={{ color: '#155dfc', fontWeight: 700 }}>
              Open AI Baby Generator
            </Link>
          </section>
        )}
      </div>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
