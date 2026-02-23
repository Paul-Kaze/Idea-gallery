import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function test() {
  const { data, error } = await supabase.from('credit_orders').select('*').limit(1)
  console.log('Orders:', data)
  if (error) console.log('Orders Error:', error)

  const { data: users, error: uError } = await supabase.from('users').select('id, email, credits').limit(1)
  console.log('Users:', users)
  if (uError) console.log('Users Error:', uError)
}
test()
