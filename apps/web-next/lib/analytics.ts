'use client'

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    gtag?: (...args: unknown[]) => void
  }
}

function cleanProperties(properties: AnalyticsProperties = {}) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined)
  )
}

export function trackEvent(event: string, properties: AnalyticsProperties = {}) {
  if (typeof window === 'undefined') return

  const payload = cleanProperties({
    ...properties,
    page_path: window.location.pathname,
    page_location: window.location.href,
  })

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...payload })
  window.gtag?.('event', event, payload)

  const body = JSON.stringify({ event, properties: payload })
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/events', new Blob([body], { type: 'application/json' }))
    return
  }

  fetch('/api/analytics/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    // Analytics should never block the product flow.
  })
}
