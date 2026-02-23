import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../auth'

// Credit packages config - productId must be set from Creem dashboard
const CREDIT_PACKAGES: Record<string, { credits: number; productId: string }> = {
    starter: { credits: 80, productId: process.env.CREEM_PRODUCT_ID_80 || 'prod_starter_80' },
    growth: { credits: 200, productId: process.env.CREEM_PRODUCT_ID_200 || 'prod_growth_200' },
    pro: { credits: 450, productId: process.env.CREEM_PRODUCT_ID_450 || 'prod_pro_450' },
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
        const apiKey = process.env.CREEM_API_KEY!
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
            return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
        }

        const data = await response.json()
        const checkoutUrl = data.checkout_url || data.url

        return NextResponse.json({ checkoutUrl })
    } catch (error) {
        console.error('[Creem Checkout] Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
