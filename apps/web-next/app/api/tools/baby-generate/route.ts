import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { supabaseAdmin } from '../../../../lib/supabase'
import { uploadBufferToOSS } from '../../../../lib/storage'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'bytedance-seed/seedream-4.5'

function buildPrompt(gender: 'girl' | 'boy'): string {
    if (gender === 'boy') {
        return `A hyper-realistic portrait photograph of a cute baby boy, around 1 to 2 years old. The baby perfectly inherits and blends the facial features, eye shape, skin tone, and hair color of the man and woman in the reference images. Bright expressive eyes, adorable gentle smile, soft natural baby skin texture, chubby cheeks. Dressed in simple, handsome baby clothes in neutral or soft blue tones. Soft studio lighting, 85mm portrait lens, blurred neutral background, 8k resolution, highly detailed, photorealistic.`
    } else {
        return `A hyper-realistic portrait photograph of a cute baby girl, around 1 to 2 years old. The baby perfectly inherits and blends the facial features, eye shape, skin tone, and hair color of the man and woman in the reference images. Bright expressive eyes, adorable gentle smile, soft natural baby skin texture, chubby cheeks. Dressed in simple, sweet baby clothes in neutral or soft pastel tones. Soft studio lighting, 85mm portrait lens, blurred neutral background, 8k resolution, highly detailed, photorealistic.`
    }
}

/**
 * Convert a base64 data URL to a Buffer
 */
function base64ToBuffer(dataUrl: string): { buffer: Buffer; mimeType: string } {
    const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
    if (!match) {
        throw new Error('Invalid base64 data URL format')
    }
    return {
        buffer: Buffer.from(match[2], 'base64'),
        mimeType: match[1],
    }
}

/**
 * Upload image buffer to Aliyun OSS, returns public URL.
 * Falls back gracefully to base64 if OSS upload fails.
 */
async function uploadToStorage(
    imageBase64Url: string,
    gender: 'girl' | 'boy'
): Promise<string> {
    const { buffer, mimeType } = base64ToBuffer(imageBase64Url)
    const ext = mimeType.split('/')[1] || 'png'
    const timestamp = Date.now()
    const prefix = process.env.OSS_KEY_PREFIX ? `${process.env.OSS_KEY_PREFIX}/` : ''
    const path = `${prefix}baby-generations/${timestamp}-${gender}.${ext}`

    const ossUrl = await uploadBufferToOSS(buffer, path, mimeType)

    if (ossUrl) {
        return ossUrl
    }

    console.error('[baby-generate] OSS upload failed, falling back to base64')
    // Fallback: return base64 so the frontend still gets an image
    return imageBase64Url
}

export async function POST(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.AUTH_SECRET })
        const apiKey = process.env.OPENROUTER_API_KEY
        if (!apiKey) {
            return NextResponse.json(
                { error: 'OpenRouter API key is not configured on the server.' },
                { status: 500 }
            )
        }

        const body = await req.json()
        const { momImage, dadImage, gender } = body as {
            momImage?: string
            dadImage?: string
            gender?: 'girl' | 'boy'
        }

        if (!momImage || !dadImage) {
            return NextResponse.json(
                { error: 'Both momImage and dadImage are required.' },
                { status: 400 }
            )
        }
        if (gender !== 'girl' && gender !== 'boy') {
            return NextResponse.json(
                { error: 'gender must be "girl" or "boy".' },
                { status: 400 }
            )
        }

        const prompt = buildPrompt(gender)

        // Build request body — include parent images as reference for image-to-image
        const payload = {
            model: MODEL,
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        { type: 'image_url', image_url: { url: momImage } },
                        { type: 'image_url', image_url: { url: dadImage } },
                    ],
                },
            ],
            modalities: ['image'],
            image_config: {
                aspect_ratio: '3:4', // Portrait-friendly ratio
                image_size: '1K',
            },
        }

        const openrouterRes = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.SITE_URL ?? 'http://localhost:3000',
                'X-Title': 'AI Baby Generator',
            },
            body: JSON.stringify(payload),
        })

        if (!openrouterRes.ok) {
            const errText = await openrouterRes.text()
            console.error('[baby-generate] OpenRouter error:', openrouterRes.status, errText)
            return NextResponse.json(
                { error: `Image generation failed (${openrouterRes.status}).` },
                { status: 502 }
            )
        }

        const result = await openrouterRes.json()

        // Extract generated image from response
        const message = result?.choices?.[0]?.message
        const imageBase64Url: string | undefined =
            message?.images?.[0]?.image_url?.url

        if (!imageBase64Url) {
            console.error('[baby-generate] No image in response:', JSON.stringify(result))
            return NextResponse.json(
                { error: 'No image was returned by the generation model.' },
                { status: 502 }
            )
        }

        // Persist the image (OSS or fallback to base64)
        const imageUrl = await uploadToStorage(imageBase64Url, gender)
        const generatedAt = new Date().toISOString()

        // Save history to database if user is logged in
        if (token?.email && supabaseAdmin) {
            const CREDITS_COST = 1

            // Retrieve current user to deduct credits
            const { data: user } = await supabaseAdmin
                .from('users')
                .select('id, credits')
                .eq('email', token.email)
                .maybeSingle()

            if (user) {
                const newCredits = Math.max(0, (user.credits || 0) - CREDITS_COST)
                await supabaseAdmin
                    .from('users')
                    .update({ credits: newCredits })
                    .eq('id', user.id)

                const { error: dbError } = await supabaseAdmin.from('tool_generations').insert({
                    user_email: token.email,
                    tool_name: 'ai_baby',
                    result_url: imageUrl,
                    metadata: { gender }, // Save specific fields in JSONB
                    credits_cost: CREDITS_COST,
                    created_at: generatedAt
                })
                if (dbError) {
                    console.error('[baby-generate] Failed to save history to DB:', dbError)
                }
            }
        }

        return NextResponse.json({
            imageUrl,
            generatedAt,
            gender,
        })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.error('[baby-generate] Unexpected error:', message)
        return NextResponse.json(
            { error: `Internal server error: ${message}` },
            { status: 500 }
        )
    }
}
