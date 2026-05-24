'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Clock3, RefreshCw } from 'lucide-react'
import { trackEvent } from '../../../lib/analytics'

type PaymentStatus = 'pending' | 'completed' | 'unknown'

export function PaymentSuccessClient({ checkoutId }: { checkoutId?: string }) {
  const [status, setStatus] = useState<PaymentStatus>('pending')
  const [credits, setCredits] = useState<number | null>(null)
  const attemptsRef = useRef(0)

  useEffect(() => {
    trackEvent('payment_success_page_viewed', {
      checkout_id_present: Boolean(checkoutId),
    })
  }, [checkoutId])

  useEffect(() => {
    let cancelled = false

    async function pollStatus() {
      attemptsRef.current += 1
      try {
        const query = checkoutId ? `?checkout_id=${encodeURIComponent(checkoutId)}` : ''
        const res = await fetch(`/api/checkout/status${query}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`status_${res.status}`)
        const data = await res.json()
        if (cancelled) return

        setCredits(data.credits ?? null)
        if (data.status === 'completed') {
          setStatus('completed')
          trackEvent('payment_success', {
            checkout_id_present: Boolean(checkoutId),
            credits_awarded: data.creditsAwarded ?? 0,
          })
          window.dispatchEvent(new Event('update-credits'))
          return
        }

        setStatus('pending')
          trackEvent('payment_pending', {
            checkout_id_present: Boolean(checkoutId),
          attempt: attemptsRef.current,
        })
      } catch {
        if (!cancelled) setStatus('unknown')
      }
    }

    pollStatus()
    const interval = window.setInterval(pollStatus, 2500)
    const timeout = window.setTimeout(() => window.clearInterval(interval), 30000)

    return () => {
      cancelled = true
      window.clearInterval(interval)
      window.clearTimeout(timeout)
    }
  }, [checkoutId])

  const isCompleted = status === 'completed'
  const Icon = isCompleted ? CheckCircle2 : status === 'pending' ? RefreshCw : Clock3

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        padding: '24px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '48px 40px',
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.12)',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            margin: '0 auto 22px',
            borderRadius: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isCompleted ? '#ecfdf5' : '#eff6ff',
            color: isCompleted ? '#059669' : '#2563eb',
          }}
        >
          <Icon size={32} style={status === 'pending' ? { animation: 'spin 1.4s linear infinite' } : undefined} />
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: '0 0 10px' }}>
          {isCompleted ? 'Credits added' : 'Payment received'}
        </h1>

        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6, marginBottom: '24px' }}>
          {isCompleted
            ? 'Your credits are available now. You can continue creating with Dommi.'
            : 'Your payment is being confirmed. Credits usually appear within a few moments after the webhook finishes.'}
        </p>

        {credits !== null ? (
          <p style={{ fontSize: '14px', color: '#374151', marginBottom: '18px' }}>
            Current balance: <strong>{credits.toLocaleString()} credits</strong>
          </p>
        ) : null}

        {checkoutId ? (
          <p
            style={{
              fontSize: '12px',
              color: '#9ca3af',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              padding: '8px 12px',
              marginBottom: '24px',
              fontFamily: 'monospace',
            }}
          >
            Order ID: {checkoutId}
          </p>
        ) : null}

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link
            href="/tools/ai-baby-generator"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '44px',
              padding: '0 22px',
              backgroundColor: '#111827',
              color: '#ffffff',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Continue creating
          </Link>
          <Link
            href="/assets"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '44px',
              padding: '0 22px',
              backgroundColor: '#ffffff',
              color: '#111827',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            View assets
          </Link>
        </div>

        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </main>
  )
}
