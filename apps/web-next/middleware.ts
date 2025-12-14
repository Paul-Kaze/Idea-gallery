import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const RATE_LIMIT = 100
const WINDOW_MS = 60_000
const buckets = new Map<string, { count: number; reset: number }>()

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/api/')) return NextResponse.next()
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const bucket = buckets.get(ip as string)
  if (!bucket || now > bucket.reset) {
    buckets.set(ip as string, { count: 1, reset: now + WINDOW_MS })
    return NextResponse.next()
  }
  if (bucket.count >= RATE_LIMIT) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }
  bucket.count++
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
