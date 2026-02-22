import path from 'path'
import fs from 'fs'
import { randomUUID } from 'crypto'
import { createRequire } from 'module'

const require = createRequire(new URL('../apps/web-next/package.json', import.meta.url))
const dotenv = require('dotenv')
const OSS = require('ali-oss')
const { createClient } = require('@supabase/supabase-js')

// 加载环境变量
dotenv.config()
dotenv.config({ path: path.resolve(process.cwd(), '../../.env'), override: true })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const ossEndpoint = process.env.OSS_ENDPOINT
const ossRegion = process.env.OSS_REGION
const ossBucket = process.env.OSS_BUCKET
const ossPrefix = process.env.OSS_KEY_PREFIX || 'ai-gallery'

// 检查必要配置
function ensure(val, name) {
  if (!val) {
    console.error(`Missing env: ${name}`)
    process.exit(1)
  }
}

ensure(supabaseUrl, 'SUPABASE_URL')
ensure(supabaseKey, 'SUPABASE_SERVICE_ROLE_KEY')
ensure(ossEndpoint, 'OSS_ENDPOINT')
ensure(ossRegion, 'OSS_REGION')
ensure(ossBucket, 'OSS_BUCKET')

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
const oss = new OSS({
  endpoint: ossEndpoint,
  region: ossRegion,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: ossBucket,
})

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase()
  const map = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
  }
  return map[ext] || 'application/octet-stream'
}

function endpointHost(ep) {
  try {
    return new URL(ep).host
  } catch {
    return String(ep).replace(/^https?:\/\//, '')
  }
}

function ossPublicUrl(key) {
  return `/api/download?key=${encodeURIComponent(key)}`
}

async function uploadFile(localPath, ossKey) {
  if (!fs.existsSync(localPath)) {
    throw new Error(`文件不存在: ${localPath}`)
  }
  const stream = fs.createReadStream(localPath)
  const mime = getMimeType(localPath)
  // console.log(`Uploading ${path.basename(localPath)} -> ${ossKey} (${mime})`)
  await oss.put(ossKey, stream, { headers: { 'Content-Type': mime } })
  return ossPublicUrl(ossKey)
}

async function main() {
  const dataDir = process.argv[2]
  if (!dataDir) {
    console.error('使用方法: node scripts/import-data.mjs <数据目录路径>')
    process.exit(1)
  }

  const absDataDir = path.resolve(process.cwd(), dataDir)
  const jsonPath = path.join(absDataDir, 'data.json')

  if (!fs.existsSync(jsonPath)) {
    console.error(`未找到 data.json: ${jsonPath}`)
    process.exit(1)
  }

  const items = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  console.log(`准备导入 ${items.length} 条数据...`)

  let successCount = 0

  for (const item of items) {
    try {
      console.log(`正在处理: ${item.filename}`)
      const fileId = randomUUID()
      const ext = path.extname(item.filename)
      const baseKey = `${ossPrefix}/${fileId}${ext}`
      const thumbKey = `${ossPrefix}/${fileId}_thumb${ext}`

      // 1. 上传主文件
      const localFilePath = path.join(absDataDir, item.filename)
      const fullUrl = await uploadFile(localFilePath, baseKey)

      // 2. 处理缩略图
      // 如果指定了 thumbnail_filename 则上传，否则如果是图片则复用原图，视频则警告
      let thumbUrl = fullUrl
      if (item.thumbnail_filename) {
         const localThumbPath = path.join(absDataDir, item.thumbnail_filename)
         thumbUrl = await uploadFile(localThumbPath, thumbKey)
      } else if (item.type === 'image') {
         // 图片直接复用原图作为缩略图（也可以选择上传一份到 thumbKey）
         thumbUrl = await uploadFile(localFilePath, thumbKey)
      } else {
         console.warn(`⚠️ 警告: 视频 ${item.filename} 未提供缩略图，将使用视频链接占位`)
      }

      // 3. 上传参考图
      const refUrls = []
      const refPaths = []
      if (item.reference_images && Array.isArray(item.reference_images)) {
        for (const refFilename of item.reference_images) {
          const refId = randomUUID()
          const refExt = path.extname(refFilename)
          const refKey = `${ossPrefix}/refs/${refId}${refExt}`
          const localRefPath = path.join(absDataDir, refFilename)
          const url = await uploadFile(localRefPath, refKey)
          refUrls.push(url)
          refPaths.push(`refs/${refId}${refExt}`)
        }
      }

      // 4. 写入数据库
      const payload = {
        type: item.type || 'image',
        model: item.model || 'Unknown',
        prompt: item.prompt || '',
        thumbnail_url: thumbUrl,
        full_url: fullUrl,
        width: item.width || 0,
        height: item.height || 0,
        duration: item.duration,
        uploaded_at: new Date().toISOString(),
        user_id: item.user_id || null, 
      }

      // 尝试写入 images 表（优先尝试新结构的 reference_image 数组字段）
      const { data: inserted, error } = await supabase.from('images').insert({
          ...payload,
          reference_image: refUrls 
      }).select().single()

      let imageId
      if (!error) {
        imageId = inserted.id
      } else if (error.message && error.message.includes('reference_image')) {
        // 如果数据库还没有 reference_image 数组字段，回退到旧表关联模式
        const { data: insertedNoRef, error: e2 } = await supabase.from('images').insert(payload).select().single()
        if (e2) throw e2
        imageId = insertedNoRef.id

        // 插入 reference_images 关联表
        if (refUrls.length > 0) {
            const refRows = refUrls.map((url, idx) => ({
                path: refPaths[idx],
                url: url,
                target_image_id: imageId
            }))
            const { error: e3 } = await supabase.from('reference_images').insert(refRows)
            if (e3) throw e3
        }
      } else {
        throw error
      }
      
      console.log(`✅ 成功导入: ${item.filename} (ID: ${imageId})`)
      successCount++

    } catch (err) {
      console.error(`❌ 处理失败 ${item.filename}:`, err)
    }
  }
  console.log(`导入完成: 成功 ${successCount} / 总数 ${items.length}`)
}

main().catch(console.error)
