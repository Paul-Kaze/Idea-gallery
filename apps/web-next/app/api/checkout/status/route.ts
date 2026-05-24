import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { supabaseAdmin } from '../../../../lib/supabase'
import { captureServerError } from '../../../../lib/monitoring'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ status: 'pending', credits: 0 })
    }

    const { searchParams } = new URL(request.url)
    const checkoutId = searchParams.get('checkout_id')

    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, credits')
      .eq('email', session.user.email)
      .maybeSingle()

    if (userError) {
      await captureServerError('checkout.status_user_lookup_failed', userError)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    if (!checkoutId || !user) {
      return NextResponse.json({ status: 'pending', credits: user?.credits ?? 0 })
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from('credit_orders')
      .select('status, credits_awarded')
      .eq('checkout_id', checkoutId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (orderError) {
      await captureServerError('checkout.status_order_lookup_failed', orderError, { checkoutId })
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    return NextResponse.json({
      status: order?.status || 'pending',
      credits: user.credits ?? 0,
      creditsAwarded: order?.credits_awarded ?? 0,
    })
  } catch (error) {
    await captureServerError('checkout.status_unexpected_error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
