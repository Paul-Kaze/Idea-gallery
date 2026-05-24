import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { captureServerError } from '../../../../lib/monitoring'
import { trackServerEvent } from '../../../../lib/server-analytics'
import { supabaseAdmin } from '../../../../lib/supabase'
import { generateWithIshencai, isIshencaiImageModel } from '../../../../lib/ishencai'
import { generateWithYunwu, type YunwuGenerateInput, type YunwuGenerationKind } from '../../../../lib/yunwu'

export const dynamic = 'force-dynamic'

type GenerateBody = {
  prompt?: string
  type?: YunwuGenerationKind
  model?: string
  mode?: string
  aspectRatio?: string
  duration?: number
  resolution?: string
  count?: number
  style?: string
  creditsCost?: number
  uploads?: Array<{
    name?: string
    type?: string
    dataURL?: string
  }>
}

function getCreditsCost(body: GenerateBody) {
  const requested = Number(body.creditsCost)
  if (Number.isFinite(requested) && requested > 0) return Math.ceil(requested)
  if (body.type === 'image') return Math.max(1, Math.ceil(body.count || 1) * 6)
  return Math.max(1, Math.ceil(body.duration || 5) * 20)
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const userEmail = session?.user?.email
    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 })
    }

    const body = (await req.json()) as GenerateBody
    const prompt = body.prompt?.trim()
    const kind = body.type === 'image' ? 'image' : body.type === 'video' ? 'video' : undefined

    if (!prompt && !body.uploads?.length) {
      return NextResponse.json({ error: 'Prompt or reference image is required.' }, { status: 400 })
    }
    if (!kind) {
      return NextResponse.json({ error: 'type must be "image" or "video".' }, { status: 400 })
    }
    if (!body.model) {
      return NextResponse.json({ error: 'model is required.' }, { status: 400 })
    }

    const estimatedCreditsCost = getCreditsCost(body)
    const creditsCost = 0

    const generationInput: YunwuGenerateInput = {
      kind,
      prompt: prompt || 'Generate from the provided reference image.',
      model: body.model,
      mode: body.mode,
      aspectRatio: body.aspectRatio,
      duration: body.duration,
      resolution: body.resolution,
      count: body.count,
      style: body.style,
      referenceImages: (body.uploads || [])
        .filter((upload) => upload.dataURL)
        .map((upload) => ({
          name: upload.name,
          type: upload.type,
          dataURL: upload.dataURL!,
        })),
    }
    const result =
      kind === 'image' && isIshencaiImageModel(body.model)
        ? await generateWithIshencai(generationInput)
        : await generateWithYunwu(generationInput)

    const generatedAt = new Date().toISOString()
    if (supabaseAdmin) {
      const { error: insertError } = await supabaseAdmin.from('tool_generations').insert({
        user_email: userEmail,
        tool_name: 'model_generate',
        result_url: result.url,
        metadata: {
          type: kind,
          model: body.model,
          mode: body.mode,
          prompt,
          aspectRatio: body.aspectRatio,
          duration: body.duration,
          resolution: body.resolution,
          count: body.count,
          style: body.style,
          provider: result.provider,
          endpoint: result.endpoint,
          taskId: result.taskId,
          estimatedCreditsCost,
          creditsDeducted: false,
        },
        credits_cost: creditsCost,
        created_at: generatedAt,
      })

      if (insertError) {
        await captureServerError('model_generate.history_insert_failed', insertError, {
          model: body.model,
          type: kind,
        })
      }
    }

    await trackServerEvent(
      'generation_succeeded',
      {
        tool_name: 'model_generate',
        model: body.model,
        type: kind,
        provider: result.provider,
        endpoint: result.endpoint,
        credits_cost: creditsCost,
        estimated_credits_cost: estimatedCreditsCost,
      },
      userEmail
    )

    return NextResponse.json({
      url: result.url,
      mediaType: result.mediaType,
      provider: result.provider,
      endpoint: result.endpoint,
      taskId: result.taskId,
      creditsCost,
      generatedAt,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[model-generate] Unexpected error:', message)
    await captureServerError('model_generate.unexpected_error', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
