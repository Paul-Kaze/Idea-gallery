import { type NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '../../../../lib/supabase'

// Map packageKey -> credits to award (fallback if metadata is missing)
const CREDITS_MAP: Record<string, number> = {
    starter: 80,
    growth: 200,
    pro: 450,
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.text()
        const signature = request.headers.get('creem-signature')

        // ── 1. Verify webhook signature ──────────────────────────────────
        if (!signature || !process.env.CREEM_WEBHOOK_SECRET) {
            console.error('[Creem Webhook] Missing signature or secret')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const expectedSignature = crypto
            .createHmac('sha256', process.env.CREEM_WEBHOOK_SECRET)
            .update(body)
            .digest('hex')

        if (signature !== expectedSignature) {
            console.error('[Creem Webhook] Invalid signature')
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }

        // ── 2. Parse event ───────────────────────────────────────────────
        console.log('[Creem Webhook] Signature verified, processing body...')
        const event = JSON.parse(body)
        console.log('[Creem Webhook] Raw Payload:', JSON.stringify(event))

        // Handle possible differences in webhook payload structure
        const eventType = event.eventType || event.type || event.event || (event.data && event.data.type)
        console.log('[Creem Webhook] Detected Event Type:', eventType)

        if (eventType !== 'checkout.completed') {
            // Acknowledge other events without processing
            console.log('[Creem Webhook] Ignored event type:', eventType)
            return NextResponse.json({ received: true })
        }

        const checkoutObj = event.object || event.data
        const checkoutId: string = checkoutObj?.id || event.id
        const metadata = checkoutObj?.metadata || {}
        const userEmail: string = metadata.referenceId
        const packageKey: string = metadata.packageKey
        const creditsToAward: number = Number(metadata.credits) || CREDITS_MAP[packageKey] || 0

        console.log('[Creem Webhook] Parsed Metadata:', { checkoutId, userEmail, packageKey, creditsToAward, metadata })

        if (!userEmail || !creditsToAward) {
            console.error('[Creem Webhook] Missing referenceId or credits in metadata', metadata)
            return NextResponse.json({ received: true })
        }

        if (!supabaseAdmin) {
            console.error('[Creem Webhook] Supabase not configured')
            return NextResponse.json({ received: true })
        }

        // ── 3. Idempotency check ─────────────────────────────────────────
        const { data: existing } = await supabaseAdmin
            .from('credit_orders')
            .select('id')
            .eq('checkout_id', checkoutId)
            .maybeSingle()

        if (existing) {
            console.log('[Creem Webhook] Already processed checkout:', checkoutId)
            return NextResponse.json({ received: true })
        }

        // ── 4. Find user by email ────────────────────────────────────────
        const { data: user } = await supabaseAdmin
            .from('users')
            .select('id, credits')
            .eq('email', userEmail)
            .maybeSingle()

        if (!user) {
            console.error('[Creem Webhook] User not found for email:', userEmail)
            return NextResponse.json({ received: true })
        }

        // ── 5. Award credits ─────────────────────────────────────────────
        const newCredits = (user.credits || 0) + creditsToAward

        const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({ credits: newCredits })
            .eq('id', user.id)

        if (updateError) {
            console.error('[Creem Webhook] Failed to update credits:', updateError)
            return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
        }

        // ── 6. Record order for idempotency ─────────────────────────────
        const productId: string = event.data?.product_id || packageKey
        await supabaseAdmin.from('credit_orders').insert({
            checkout_id: checkoutId,
            user_id: user.id,
            product_id: productId,
            credits_awarded: creditsToAward,
            status: 'completed'
        })

        console.log(`[Creem Webhook] Awarded ${creditsToAward} credits to user ${userEmail}`)
        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('[Creem Webhook] Unexpected error:', error)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}
