import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })
if (!process.env.SUPABASE_URL) {
    dotenv.config({ path: path.resolve(__dirname, '../../.env') })
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function exportUsers() {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error exporting users:', error.message)
        process.exit(1)
    }

    const outputPath = path.resolve(__dirname, '../users_export.json')
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2))
    console.log(`Exported ${data.length} users to ${outputPath}`)
}

exportUsers().catch(console.error)
