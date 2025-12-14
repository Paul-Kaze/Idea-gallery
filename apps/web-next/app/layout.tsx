import { SessionProvider } from '../components/providers/SessionProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true' ? (
          <SessionProvider>{children}</SessionProvider>
        ) : (
          children
        )}
      </body>
    </html>
  )
}
