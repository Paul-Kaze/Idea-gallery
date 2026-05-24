'use client'

import type React from 'react'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent } from '../../lib/analytics'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const previousPath = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname || previousPath.current === pathname) return
    previousPath.current = pathname
    trackEvent('page_viewed', {
      page_path: pathname,
      page_title: document.title,
    })
  }, [pathname])

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null
      const trackedElement = target?.closest<HTMLElement>('[data-analytics-event]')
      if (!trackedElement) return

      trackEvent(trackedElement.dataset.analyticsEvent || 'cta_clicked', {
        location: trackedElement.dataset.analyticsLocation,
        label: trackedElement.dataset.analyticsLabel || trackedElement.textContent?.trim().slice(0, 80),
        href: trackedElement instanceof HTMLAnchorElement ? trackedElement.href : undefined,
      })
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return <>{children}</>
}
