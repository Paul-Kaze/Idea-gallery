import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { supabaseAdmin } from '../../../../../lib/supabase'

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.AUTH_SECRET })

        // If the user isn't logged in, simply return an empty history list
        if (!token?.email) {
            return NextResponse.json({ history: [] })
        }

        if (!supabaseAdmin) {
            // No DB configured, return empty
            return NextResponse.json({ history: [] })
        }

        const { data, error } = await supabaseAdmin
            .from('tool_generations')
            .select('id, result_url, metadata, created_at')
            .eq('user_email', token.email)
            .eq('tool_name', 'ai_baby')
            .order('created_at', { ascending: false })
            .limit(50) // Keep response size reasonable

        if (error) {
            console.error('[baby-generate-history] DB fetch error:', error)
            return NextResponse.json(
                { error: 'Failed to fetch history', history: [] },
                { status: 500 }
            )
        }

        // Map database fields to frontend expected format
        const history = (data || []).map(item => ({
            id: item.id,
            imageUrl: item.result_url,
            gender: (item.metadata as any)?.gender,
            generatedAt: item.created_at
        }))

        return NextResponse.json({ history })

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.error('[baby-generate-history] Unexpected error:', message)
        return NextResponse.json(
            { error: `Internal server error: ${message}`, history: [] },
            { status: 500 }
        )
    }
}
