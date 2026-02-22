import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Try loading from app dir first, then root
dotenv.config({ path: path.resolve(__dirname, '../.env') })
if (!process.env.SUPABASE_URL) {
    dotenv.config({ path: path.resolve(__dirname, '../../.env') })
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function queryAll() {
    // Query all table names in public schema
    const { data: tableList, error: listError } = await supabase
        .rpc('get_tables') // This might not work if RPC doesn't exist
        .catch(() => ({ data: null }))

    // Alternative way to list tables
    const { data: infoSchema, error: infoError } = await supabase
        .from('pg_tables') // This usually requires special permissions
        .select('tablename')
        .eq('schemaname', 'public')
        .catch(() => ({ data: null }))

    console.log('Tables in public schema:', infoSchema?.map(t => t.tablename).join(', ') || 'Unknown')

    const tables = ['users', 'images', 'reference_images', 'baby_generations', 'credit_orders']

    for (const table of tables) {
        console.log(`\n--- Table: ${table} ---`)
        const { data, error } = await supabase.from(table).select('*')
        if (error) {
            console.error(`Error querying ${table}:`, error.message)
        } else {
            console.table(data)
        }
    }
}

queryAll().catch(console.error)
