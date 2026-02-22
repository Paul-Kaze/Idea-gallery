import './globals.css'
import { SessionProvider } from '../components/providers/SessionProvider'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'

  return (
    <html lang="en">
      <body style={{ margin: 0, display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa' }}>
        {authEnabled ? (
          <SessionProvider>
            <Header />
            <Sidebar />
            <main
              style={{
                flex: 1,
                minWidth: 0,
                position: 'relative',
                paddingTop: '64px', // account for fixed Header
                paddingLeft: '80px', // account for fixed Sidebar
              }}
            >
              {children}
            </main>
          </SessionProvider>
        ) : (
          <>
            <Header />
            <Sidebar />
            <main
              style={{
                flex: 1,
                minWidth: 0,
                position: 'relative',
                paddingTop: '64px', // account for fixed Header
                paddingLeft: '80px', // account for fixed Sidebar
              }}
            >
              {children}
            </main>
          </>
        )}
      </body>
    </html>
  )
}
