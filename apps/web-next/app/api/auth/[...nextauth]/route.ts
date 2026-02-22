import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { ProxyAgent, setGlobalDispatcher } from 'undici'
import { supabaseAdmin } from '../../../../lib/supabase'

if (process.env.https_proxy || process.env.http_proxy) {
  const proxyUrl = process.env.https_proxy || process.env.http_proxy
  if (proxyUrl) {
    const dispatcher = new ProxyAgent({ uri: proxyUrl })
    setGlobalDispatcher(dispatcher)
  }
}

export const {
  handlers: { GET, POST },
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, profile }) {
      if (!user.email || !supabaseAdmin) {
        console.warn('[NextAuth] Skip sync: no email or supabaseAdmin')
        return true
      }

      try {
        const { error } = await supabaseAdmin
          .from('users')
          .upsert(
            {
              email: user.email,
              name: user.name ?? 'Unknown User',
              avatar_url: user.image ?? (profile as any)?.picture ?? null,
            },
            { onConflict: 'email' }
          )

        if (error) {
          console.error('[NextAuth] Error syncing user to DB:', error)
        } else {
          console.log('[NextAuth] User synced to DB:', user.email)
        }
      } catch (err) {
        console.error('[NextAuth] Unexpected error during signIn sync:', err)
      }

      return true
    },
  },
})
