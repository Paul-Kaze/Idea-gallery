import './globals.css'
import type { Metadata } from 'next'
import { SessionProvider } from '../components/providers/SessionProvider'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { AnalyticsScripts } from '../components/AnalyticsScripts'
import { AnalyticsProvider } from '../components/providers/AnalyticsProvider'
import { getSiteUrl } from '../lib/site'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Dommi',
  title: {
    default: 'Dommi - AI Creative Tools',
    template: '%s',
  },
  description: 'Create AI images, videos, and playful photo tools with Dommi.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Dommi - AI Creative Tools',
    description: 'Create AI images, videos, and playful photo tools with Dommi.',
    url: '/',
    siteName: 'Dommi',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Dommi',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Dommi - AI Creative Tools',
    description: 'Create AI images, videos, and playful photo tools with Dommi.',
    images: ['/logo.png'],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'

  return (
    <html lang="en">
      <body style={{ margin: 0, display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <AnalyticsScripts />
        {authEnabled ? (
          <SessionProvider>
            <AnalyticsProvider>
              <Header />
              <Sidebar />
              <main
                style={{
                  flex: 1,
                  width: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  position: 'relative',
                  paddingTop: '64px', // account for fixed Header
                  paddingLeft: '80px', // account for fixed Sidebar
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ flex: 1 }}>
                  {children}
                </div>
                <Footer />
              </main>
            </AnalyticsProvider>
          </SessionProvider>
        ) : (
          <AnalyticsProvider>
            <Header />
            <Sidebar />
            <main
              style={{
                flex: 1,
                width: '100%',
                minWidth: 0,
                boxSizing: 'border-box',
                position: 'relative',
                paddingTop: '64px', // account for fixed Header
                paddingLeft: '80px', // account for fixed Sidebar
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ flex: 1 }}>
                {children}
              </div>
              <Footer />
            </main>
          </AnalyticsProvider>
        )}
      </body>
    </html>
  )
}
