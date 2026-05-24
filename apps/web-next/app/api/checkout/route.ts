import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../auth'
import { trackServerEvent } from '../../../lib/server-analytics'
import { captureServerError } from '../../../lib/monitoring'

// Credit packages config - productId must be set from Creem dashboard
const CREDIT_PACKAGES: Record<string, { credits: number; productId: string }> = {
    starter: { credits: 80, productId: process.env.CREEM_PRODUCT_ID_80 || 'prod_1Y81AeNom1Iy1mC8TI42S9' },
    growth: { credits: 200, productId: process.env.CREEM_PRODUCT_ID_200 || 'prod_3fv5ltUWpk1ZmOiTMJqlFc' },
    pro: { credits: 450, productId: process.env.CREEM_PRODUCT_ID_450 || 'prod_63Xx8G8IvlSQlW6mo1s5Zu' },
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { packageKey } = await request.json()
        const pkg = CREDIT_PACKAGES[packageKey]
        if (!pkg) {
            return NextResponse.json({ error: 'Invalid package' }, { status: 400 })
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const successUrl = `${appUrl}/payment/success`

        // Call Creem API to create a checkout session
        const apiKey = process.env.CREEM_API_KEY
        if (!apiKey) {
            await captureServerError('checkout.missing_creem_api_key', new Error('Creem API key is not configured'), { packageKey })
            return NextResponse.json({ error: 'Payment service is temporarily unavailable' }, { status: 500 })
        }

        await trackServerEvent('checkout_started', {
            package_key: packageKey,
            credits: pkg.credits,
            product_id: pkg.productId,
        }, session.user.email)

        const isTestMode = apiKey.startsWith('creem_test_')
        const apiUrl = isTestMode ? 'https://test-api.creem.io/v1/checkouts' : 'https://api.creem.io/v1/checkouts'

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({
                product_id: pkg.productId,
                success_url: successUrl,
                metadata: {
                    // Pass user email so webhook can identify which user to credit
                    referenceId: session.user.email,
                    packageKey,
                    credits: pkg.credits,
                },
            }),
        })

        if (!response.ok) {
            const err = await response.text()
            console.error('[Creem Checkout] API error:', err)
            await captureServerError('checkout.creem_api_failed', err, {
                packageKey,
                status: response.status,
            })
            await trackServerEvent('checkout_failed', {
                package_key: packageKey,
                status: response.status,
            }, session.user.email)
            return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
        }

        const data = await response.json()
        const checkoutUrl = data.checkout_url || data.url

        return NextResponse.json({ checkoutUrl })
    } catch (error) {
        console.error('[Creem Checkout] Unexpected error:', error)
        await captureServerError('checkout.unexpected_error', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
