import { type NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { supabaseAdmin } from '../../../../lib/supabase'

export async function GET(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
        if (!token?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!supabaseAdmin) {
            // Fallback: return 0 credits if DB not configured
            return NextResponse.json({ credits: 0 })
        }

        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('credits')
            .eq('email', token.email as string)
            .maybeSingle()

        if (error) {
            console.error('[Credits API] DB error:', error)
            return NextResponse.json({ error: 'DB error' }, { status: 500 })
        }

        return NextResponse.json({ credits: user?.credits ?? 0 })
    } catch (error) {
        console.error('[Credits API] Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
