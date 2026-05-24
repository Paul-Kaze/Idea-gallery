type MonitoringContext = Record<string, unknown>

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Unknown error'
}

function cleanContext(context: MonitoringContext = {}) {
  const blockedKeys = new Set(['email', 'userEmail', 'momImage', 'dadImage', 'imageUrl', 'token', 'signature'])
  return Object.fromEntries(
    Object.entries(context).filter(([key, value]) => !blockedKeys.has(key) && value !== undefined)
  )
}

export async function captureServerError(
  source: string,
  error: unknown,
  context: MonitoringContext = {}
) {
  const message = getErrorMessage(error)
  const payload = {
    source,
    message,
    context: cleanContext(context),
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  }

  console.error(`[monitoring] ${source}:`, message, payload.context)

  const webhookUrl = process.env.ERROR_ALERT_WEBHOOK_URL || process.env.ALERT_WEBHOOK_URL
  if (!webhookUrl) return

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `[Dommi] ${source}: ${message}`,
        ...payload,
      }),
      signal: AbortSignal.timeout(2000),
    })
  } catch (notifyError) {
    console.warn('[monitoring] Failed to send alert:', notifyError)
  }
}
