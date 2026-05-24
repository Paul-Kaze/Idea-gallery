import { supabaseAdmin } from './supabase'
export let __supabaseAdmin = supabaseAdmin
export function __setSupabaseAdmin(c: any) { __supabaseAdmin = c } // 用于测试

// 数据库中的图片列表项
export type ListItem = {
  id: string
  type: 'image' | 'video'
  thumbnail_url: string
  model: string
  width: number
  height: number
}

// 数据库中的图片详情项
export type DetailItem = {
  id: string
  type: 'image' | 'video'
  full_url: string
  model: string
  prompt: string
  width: number
  height: number
  duration?: string | null
  reference_image?: string[] | null
}


export async function listImages(page = 1, size = 20): Promise<{ items: ListItem[]; total: number; hasNext: boolean }> {
  if (!__supabaseAdmin) {
    return { items: [], total: 0, hasNext: false }
  }

  const start = (page - 1) * size
  const end = start + size - 1
  const { data, error, count } = await __supabaseAdmin
    .from('images')//从images表中查询
    .select('id,type,thumbnail_url,model,width,height', { count: 'exact' })
    .order('uploaded_at', { ascending: false })
    .range(start, end)
  if (error) throw error
  const total = count ?? 0
  const hasNext = end + 1 < total
  return { items: (data as any) as ListItem[], total, hasNext }
}

export async function getImageDetail(id: string): Promise<DetailItem | null> {
  if (!__supabaseAdmin) return null
  const { data, error } = await __supabaseAdmin
    .from('images')
    .select(`
      id, type, full_url, model, prompt, width, height, duration,
      reference_images (
        url
      )
    `)
    .eq('id', id)
    .limit(1)
    .maybeSingle()
  if (error) throw error
  if (!data) return null

  // Transform the joined reference_images table data back to a flat array of URLs
  const raw = data as any
  const refs = Array.isArray(raw.reference_images)
    ? raw.reference_images.map((r: any) => r.url)
    : []

  return {
    ...raw,
    reference_image: refs,
  } as DetailItem
}
