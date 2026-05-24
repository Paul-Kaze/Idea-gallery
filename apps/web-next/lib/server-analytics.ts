import crypto from 'node:crypto'

type AnalyticsProperties = Record<string, unknown>

const POSTHOG_HOST = process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
const POSTHOG_KEY = process.env.POSTHOG_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY

export function getDistinctId(value?: string | null) {
  if (!value) return 'anonymous'
  return crypto.createHash('sha256').update(value.toLowerCase()).digest('hex')
}

function sanitizeProperties(properties: AnalyticsProperties = {}) {
  const blockedKeys = new Set(['email', 'user_email', 'momImage', 'dadImage', 'image', 'imageUrl'])
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => !blockedKeys.has(key) && value !== undefined)
  )
}

export async function trackServerEvent(
  event: string,
  properties: AnalyticsProperties = {},
  distinctSource?: string | null
) {
  if (!POSTHOG_KEY) return

  try {
    await fetch(`${POSTHOG_HOST.replace(/\/+$/, '')}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        event,
        distinct_id: getDistinctId(distinctSource),
        properties: sanitizeProperties(properties),
      }),
      signal: AbortSignal.timeout(1500),
    })
  } catch (error) {
    console.warn('[analytics] Failed to send event:', event, error)
  }
}
