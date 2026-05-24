import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { supabaseAdmin } from '../../../../lib/supabase'
import { captureServerError } from '../../../../lib/monitoring'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!supabaseAdmin) {
            // Fallback: return 0 credits if DB not configured
            return NextResponse.json({ credits: 0 })
        }

        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('credits')
            .eq('email', session.user.email)
            .maybeSingle()

        if (error) {
            console.error('[Credits API] DB error:', error)
            await captureServerError('api.user_credits_db_error', error)
            return NextResponse.json({ error: 'DB error' }, { status: 500 })
        }

        return NextResponse.json({ credits: user?.credits ?? 0 })
    } catch (error) {
        console.error('[Credits API] Unexpected error:', error)
        await captureServerError('api.user_credits_unexpected_error', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
