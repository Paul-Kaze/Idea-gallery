import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })

async function main() {
    console.log('Unlinking users from images to prevent foreign key constraint errors...')
    const { error: unlinkError } = await supabase
        .from('images')
        .update({ user_id: null })
        .not('user_id', 'is', null)

    if (unlinkError) {
        console.error('Failed to unlink users from images:', unlinkError)
        process.exit(1)
    }

    console.log('Clearing users table...')
    const { error } = await supabase
        .from('users')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Deletes all rows

    if (error) {
        console.error('Failed to clear users:', error)
        process.exit(1)
    }

    console.log('Users table cleared successfully.')
}

main()
