import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })
if (!process.env.SUPABASE_URL) {
    dotenv.config({ path: path.resolve(__dirname, '../../.env') })
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function summarize() {
    const tables = ['users', 'images', 'reference_images', 'baby_generations', 'credit_orders']
    const results = {}

    for (const table of tables) {
        const { count, error: countError } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true })

        if (countError) {
            results[table] = { status: 'error', message: countError.message }
            continue
        }

        const { data: samples, error: sampleError } = await supabase
            .from(table)
            .select('*')
            .limit(3)

        results[table] = {
            status: 'ok',
            count: count || 0,
            samples: samples || []
        }
    }

    console.log(JSON.stringify(results, null, 2))
}

summarize().catch(console.error)
