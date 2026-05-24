import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { trackServerEvent } from '../../../../lib/server-analytics'

const EVENT_NAME = /^[a-z][a-z0-9_]{1,80}$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const event = body?.event
    const properties = body?.properties || {}

    if (typeof event !== 'string' || !EVENT_NAME.test(event)) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
    }

    const session = await auth()
    await trackServerEvent(event, properties, session?.user?.email)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
