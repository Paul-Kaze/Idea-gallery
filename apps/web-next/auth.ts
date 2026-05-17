import NextAuth, { customFetch } from 'next-auth'
import Google from 'next-auth/providers/google'
import { ProxyAgent, fetch as undiciFetch } from 'undici'
import { supabaseAdmin } from './lib/supabase'

// Build a proxy-aware fetch only for OAuth (Google) requests,
// without polluting the global dispatcher that Supabase also uses.
const proxyUrl = process.env.AUTH_PROXY_URL || process.env.https_proxy || process.env.http_proxy

const proxySymbol = proxyUrl
    ? (...args: Parameters<typeof fetch>) => {
        const dispatcher = new ProxyAgent({ uri: proxyUrl })
        return undiciFetch(args[0] as any, { ...(args[1] as any), dispatcher }) as unknown as ReturnType<typeof fetch>
    }
    : undefined

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    ...(proxySymbol ? { [customFetch]: proxySymbol } : {}),
    session: { strategy: 'jwt' },
    trustHost: true,
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
